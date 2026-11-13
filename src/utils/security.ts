/**
 * Security & License Key Management for BiasharaBase.com
 * "THE QUIET SALES ENGINE"
 *
 * Cryptographically-checksummed license keys & authorized buyer passcodes.
 * Syncs with Cloud Firestore + optional Supabase & Make.com automation webhook.
 */

import { IssuedPasscode } from '../types/biashara';

const SECRET_SALT = 89;
export const MASTER_ADMIN_KEY = 'BB-ADMIN-2025';
const PASSCODES_STORAGE_KEY = 'biashara_authorized_passcodes';
const SESSION_STORAGE_KEY = 'biashara_active_user_license';

export function generateCustomerLicenseKey(buyerName: string): string {
  const cleanName = buyerName.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'VIP';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const base = `BB-${cleanName}-${randNum}`;

  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += base.charCodeAt(i) * (i + 1);
  }
  const checkChar = String.fromCharCode(65 + ((sum + SECRET_SALT) % 26));
  const checkDigit = String((sum + SECRET_SALT) % 10);
  return `${base}-${checkChar}${checkDigit}`;
}

export function verifyLicenseKeyChecksum(code: string): boolean {
  if (!code || !code.startsWith('BB-')) return false;
  const parts = code.split('-');
  if (parts.length < 4) return false;

  const checkPart = parts[parts.length - 1];
  if (checkPart.length !== 2) return false;

  const base = parts.slice(0, parts.length - 1).join('-');
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += base.charCodeAt(i) * (i + 1);
  }
  const expectedChar = String.fromCharCode(65 + ((sum + SECRET_SALT) % 26));
  const expectedDigit = String((sum + SECRET_SALT) % 10);
  return checkPart === `${expectedChar}${expectedDigit}`;
}

export function getAuthorizedPasscodes(): IssuedPasscode[] {
  try {
    const saved = localStorage.getItem(PASSCODES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveAuthorizedPasscodes(codes: IssuedPasscode[]): void {
  try {
    localStorage.setItem(PASSCODES_STORAGE_KEY, JSON.stringify(codes));
  } catch (e) {
    console.error(e);
  }
}

export function issueNewPasscode(
  buyerName: string,
  notes?: string,
  extra?: {
    email?: string;
    orderId?: string;
    paymentMethod?: string;
    amount?: number;
    currency?: string;
    source?: string;
  }
): IssuedPasscode {
  const code = generateCustomerLicenseKey(buyerName);
  const now = new Date().toISOString();
  const newPasscode: IssuedPasscode = {
    id: code,
    code,
    buyerName: buyerName.trim() || 'Valued Customer',
    email: extra?.email?.trim() || '',
    orderId: extra?.orderId?.trim() || `ORD-${Date.now().toString().slice(-6)}`,
    paymentStatus: 'Paid',
    paymentMethod: extra?.paymentMethod || 'Manual Issue',
    amount: extra?.amount ?? 25000,
    currency: extra?.currency || 'TZS',
    createdAt: now,
    isActive: true,
    activated: false,
    notes: notes?.trim() || 'Paid Order',
    source: extra?.source || 'Admin'
  };

  const current = getAuthorizedPasscodes();
  const updated = [newPasscode, ...current.filter(p => p.code !== code)];
  saveAuthorizedPasscodes(updated);
  return newPasscode;
}

export function revokePasscode(codeToRevoke: string): void {
  const current = getAuthorizedPasscodes();
  const updated = current.map(p =>
    p.code === codeToRevoke ? { ...p, isActive: false, paymentStatus: 'Revoked' as const } : p
  );
  saveAuthorizedPasscodes(updated);
}

export function reactivatePasscode(codeToRestore: string): void {
  const current = getAuthorizedPasscodes();
  const updated = current.map(p =>
    p.code === codeToRestore ? { ...p, isActive: true, paymentStatus: 'Paid' as const } : p
  );
  saveAuthorizedPasscodes(updated);
}

export function isAdminKeyMatch(inputCode: string, customAdminPin?: string): boolean {
  if (!inputCode) return false;
  const clean = inputCode.trim().toUpperCase();
  const configured = (customAdminPin || '').trim().toUpperCase();
  if (configured) {
    return clean === configured;
  }
  return clean === MASTER_ADMIN_KEY;
}

export function validatePasscode(
  inputCode: string,
  cloudLicenses?: IssuedPasscode[],
  customAdminPin?: string
): boolean {
  if (!inputCode) return false;
  const clean = inputCode.trim().toUpperCase();

  // 1. Owner Master Key (default or custom adminPin)
  if (isAdminKeyMatch(clean, customAdminPin)) {
    return true;
  }

  // 2. Check cloud licenses if provided (authoritative pending/revocation check)
  if (cloudLicenses && cloudLicenses.length > 0) {
    const cloudMatch = cloudLicenses.find(p => p.code.toUpperCase() === clean);
    if (cloudMatch) {
      return Boolean(cloudMatch.isActive);
    }
  }

  // 3. Check local registered authorized passcodes table
  const authorizedList = getAuthorizedPasscodes();
  const matched = authorizedList.find(p => p.code.toUpperCase() === clean);
  if (matched) {
    return matched.isActive;
  }

  // 4. Mathematical algorithmic verification for newly issued buyer keys
  if (verifyLicenseKeyChecksum(clean)) {
    return true;
  }

  return false;
}

export interface UserLicenseSession {
  code: string;
  buyerName: string;
  email?: string;
  isAdmin: boolean;
  activatedAt: string;
  method?: string;
}

export function getStoredUserLicense(): UserLicenseSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: UserLicenseSession = JSON.parse(raw);
    if (session && session.code && validatePasscode(session.code)) {
      return session;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function saveUserLicenseSession(session: UserLicenseSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error(e);
  }
}

export function clearUserLicenseSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function isAccessPermitted(
  sectionOrTab: string,
  userLicense: UserLicenseSession | null
): boolean {
  if (userLicense && validatePasscode(userLicense.code)) {
    return true;
  }
  if (sectionOrTab === 'ch01' || sectionOrTab === 'bio_evaluator_preview') {
    return true;
  }
  return false;
}

export function issueInstantAutomatedLicense(
  buyerName: string,
  paymentMethod: string,
  referenceId: string,
  email?: string,
  amount?: number,
  currency?: string
): { passcode: IssuedPasscode; session: UserLicenseSession } {
  const cleanName = buyerName.trim() || 'Valued Customer';
  const cleanRef = referenceId.trim() || `ORD-${Date.now().toString().slice(-6)}`;
  const code = generateCustomerLicenseKey(cleanName);
  const now = new Date().toISOString();

  const passcode: IssuedPasscode = {
    id: code,
    code,
    buyerName: cleanName,
    email: email?.trim() || '',
    orderId: cleanRef,
    paymentStatus: 'Paid',
    paymentMethod,
    amount: amount ?? (currency === 'USD' ? 10 : 25000),
    currency: currency || (paymentMethod.toLowerCase().includes('usd') || paymentMethod.toLowerCase().includes('selar') || paymentMethod.toLowerCase().includes('card') ? 'USD' : 'TZS'),
    createdAt: now,
    isActive: true,
    activated: true,
    activatedAt: now,
    notes: `${paymentMethod} · Ref: ${cleanRef}${email ? ` · ${email}` : ''}`,
    source: paymentMethod.toLowerCase().includes('selar') || paymentMethod.toLowerCase().includes('card') ? 'Selar / Card' : 'Mobile Money'
  };

  const current = getAuthorizedPasscodes();
  saveAuthorizedPasscodes([passcode, ...current.filter(p => p.code !== code)]);

  const session: UserLicenseSession = {
    code,
    buyerName: cleanName,
    email: email?.trim() || '',
    isAdmin: false,
    activatedAt: now,
    method: paymentMethod
  };
  saveUserLicenseSession(session);

  return { passcode, session };
}

export function createPendingMobileMoneyLicense(
  buyerName: string,
  paymentMethod: string,
  referenceId: string,
  email?: string,
  phone?: string,
  amount?: number
): IssuedPasscode {
  const cleanName = buyerName.trim() || 'Valued Customer';
  const cleanRef = referenceId.trim().toUpperCase() || `MM-${Date.now().toString().slice(-6)}`;
  const code = generateCustomerLicenseKey(cleanName);
  const now = new Date().toISOString();

  return {
    id: code,
    code,
    buyerName: cleanName,
    email: email?.trim() || '',
    orderId: cleanRef,
    paymentStatus: 'Pending',
    paymentMethod,
    amount: amount ?? 25000,
    currency: 'TZS',
    createdAt: now,
    isActive: false,
    activated: false,
    notes: `${paymentMethod} · Ref: ${cleanRef}${phone ? ` · WA: ${phone}` : ''}`,
    source: 'Mobile Money (Pending)'
  };
}
