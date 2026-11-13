/**
 * Cloud Firestore & Automation Sync Service for The Quiet Sales Engine
 * Handles live synchronization across customer devices, Seller Admin dashboard,
 * optional Make.com webhook triggers, and optional Supabase license mirror checks.
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from '../firebase';
import {
  IssuedPasscode,
  EngineOrderRecord,
  EngineAppSettings,
  BuyerWorkspaceState
} from '../types/biashara';

export const DEFAULT_ENGINE_SETTINGS: EngineAppSettings = {
  id: 'config',
  priceTZS: 25000,
  priceUSD: 10,
  sellerWhatsApp: '+255757895896',
  lipaNamba: '0757 895 896',
  lipaName: 'SARAH KAPUYA',
  selarCheckoutUrl: '',
  makeWebhookUrl: '',
  supabaseProjectUrl: '',
  supabaseAnonKey: '',
  guideTitle: 'THE QUIET SALES ENGINE',
  adminPin: 'BB-ADMIN-2025',
  buyerReviews: [],
  updatedAt: new Date().toISOString()
};

function sanitizeDocId(raw: string): string {
  return (raw || 'doc').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'doc';
}

export const engineFirestoreService = {
  async initConnection(): Promise<boolean> {
    return await testConnection();
  },

  async saveLicense(license: IssuedPasscode): Promise<void> {
    const docId = sanitizeDocId(license.id || license.code);
    const path = `engine_licenses/${docId}`;
    try {
      await setDoc(doc(db, 'engine_licenses', docId), {
        id: docId,
        code: String(license.code).slice(0, 50),
        buyerName: String(license.buyerName || 'Valued Customer').slice(0, 100),
        email: String(license.email || '').slice(0, 120),
        orderId: String(license.orderId || `ORD-${Date.now().toString().slice(-6)}`).slice(0, 80),
        paymentStatus: license.isActive
          ? (license.paymentStatus === 'Pending' ? 'Paid' : license.paymentStatus || 'Paid')
          : (license.paymentStatus === 'Pending' ? 'Pending' : 'Revoked'),
        paymentMethod: String(license.paymentMethod || 'Manual Issue').slice(0, 60),
        amount: Number(license.amount) || 0,
        currency: String(license.currency || 'TZS').slice(0, 10),
        createdAt: String(license.createdAt || new Date().toISOString()).slice(0, 50),
        isActive: Boolean(license.isActive),
        activated: Boolean(license.activated),
        ...(license.activatedAt ? { activatedAt: String(license.activatedAt).slice(0, 50) } : {}),
        ...(license.emailResentAt ? { emailResentAt: String(license.emailResentAt).slice(0, 50) } : {}),
        notes: String(license.notes || '').slice(0, 300),
        source: String(license.source || 'Admin').slice(0, 40)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveOrder(order: EngineOrderRecord): Promise<void> {
    const docId = sanitizeDocId(order.id);
    const path = `engine_orders/${docId}`;
    try {
      await setDoc(doc(db, 'engine_orders', docId), {
        id: docId,
        buyerName: String(order.buyerName || 'Valued Customer').slice(0, 100),
        email: String(order.email || '').slice(0, 120),
        amount: Number(order.amount) || 0,
        currency: String(order.currency || 'TZS').slice(0, 10),
        paymentMethod: String(order.paymentMethod || 'Card').slice(0, 60),
        referenceId: String(order.referenceId || docId).slice(0, 80),
        licenseCode: String(order.licenseCode).slice(0, 50),
        timestamp: String(order.timestamp || new Date().toISOString()).slice(0, 50),
        status: order.status || 'Paid',
        source: String(order.source || 'Automated').slice(0, 40)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateLicenseStatus(code: string, isActive: boolean): Promise<void> {
    const docId = sanitizeDocId(code);
    const path = `engine_licenses/${docId}`;
    try {
      await updateDoc(doc(db, 'engine_licenses', docId), {
        isActive,
        paymentStatus: isActive ? 'Paid' : 'Revoked'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async approvePendingOrderAndLicense(code: string, orderId?: string): Promise<void> {
    const licenseDocId = sanitizeDocId(code);
    const licensePath = `engine_licenses/${licenseDocId}`;
    try {
      await updateDoc(doc(db, 'engine_licenses', licenseDocId), {
        isActive: true,
        paymentStatus: 'Paid'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, licensePath);
    }

    if (orderId) {
      const orderDocId = sanitizeDocId(orderId);
      const orderPath = `engine_orders/${orderDocId}`;
      try {
        const snap = await getDoc(doc(db, 'engine_orders', orderDocId));
        if (snap.exists()) {
          await updateDoc(doc(db, 'engine_orders', orderDocId), {
            status: 'Paid'
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, orderPath);
      }
    }
  },

  async markLicenseActivated(code: string, buyerName?: string): Promise<void> {
    const docId = sanitizeDocId(code);
    const path = `engine_licenses/${docId}`;
    const now = new Date().toISOString();
    try {
      const ref = doc(db, 'engine_licenses', docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const existing = snap.data();
        if (!existing.activated) {
          await updateDoc(ref, {
            activated: true,
            activatedAt: now
          });
        }
      } else {
        await setDoc(ref, {
          id: docId,
          code: code.slice(0, 50),
          buyerName: (buyerName || 'Member').slice(0, 100),
          email: '',
          orderId: `ACT-${Date.now().toString().slice(-6)}`,
          paymentStatus: 'Paid',
          paymentMethod: 'Access Key',
          amount: 0,
          currency: 'TZS',
          createdAt: now,
          isActive: true,
          activated: true,
          activatedAt: now,
          notes: 'Activated on client browser',
          source: 'Direct Link'
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async markEmailResent(code: string): Promise<void> {
    const docId = sanitizeDocId(code);
    const path = `engine_licenses/${docId}`;
    try {
      await updateDoc(doc(db, 'engine_licenses', docId), {
        emailResentAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async verifyCodeInCloud(
    codeOrEmail: string,
    settings?: EngineAppSettings
  ): Promise<{ valid: boolean; revoked?: boolean; pending?: boolean; license?: IssuedPasscode }> {
    const trimmed = codeOrEmail.trim();
    const clean = trimmed.toUpperCase();
    const cleanLower = trimmed.toLowerCase();
    const isEmail = trimmed.includes('@');
    const docId = sanitizeDocId(clean);

    // 1. Check Firestore engine_licenses (by code or email)
    try {
      if (!isEmail) {
        const snap = await getDoc(doc(db, 'engine_licenses', docId));
        if (snap.exists()) {
          const data = snap.data() as IssuedPasscode;
          const isPending = !data.isActive && data.paymentStatus === 'Pending';
          return {
            valid: Boolean(data.isActive),
            pending: isPending,
            revoked: !data.isActive && !isPending,
            license: data
          };
        }
        const q = query(collection(db, 'engine_licenses'), where('code', '==', clean));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const data = qSnap.docs[0].data() as IssuedPasscode;
          const isPending = !data.isActive && data.paymentStatus === 'Pending';
          return {
            valid: Boolean(data.isActive),
            pending: isPending,
            revoked: !data.isActive && !isPending,
            license: data
          };
        }
      } else {
        const qEmail = query(collection(db, 'engine_licenses'), where('email', '==', cleanLower));
        const emailSnap = await getDocs(qEmail);
        if (!emailSnap.empty) {
          const data = emailSnap.docs[0].data() as IssuedPasscode;
          const isPending = !data.isActive && data.paymentStatus === 'Pending';
          return {
            valid: Boolean(data.isActive),
            pending: isPending,
            revoked: !data.isActive && !isPending,
            license: data
          };
        }
      }
    } catch (error) {
      console.warn('Firestore code lookup note:', error);
    }

    // 2. Optional Supabase REST table verification if Seller configured Supabase URL + Key
    if (settings?.supabaseProjectUrl && settings?.supabaseAnonKey) {
      try {
        const baseUrl = settings.supabaseProjectUrl.replace(/\/+$/, '');
        const filterQuery = isEmail
          ? `email=ilike.${encodeURIComponent(cleanLower)}`
          : `access_code=eq.${encodeURIComponent(clean)}`;
        const res = await fetch(
          `${baseUrl}/rest/v1/licenses?${filterQuery}&select=*`,
          {
            headers: {
              apikey: settings.supabaseAnonKey,
              Authorization: `Bearer ${settings.supabaseAnonKey}`
            }
          }
        );
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0];
            const active = row.status !== 'revoked' && row.is_active !== false;
            const resolvedCode = String(row.access_code || clean).toUpperCase();
            return {
              valid: active,
              revoked: !active,
              license: {
                id: resolvedCode,
                code: resolvedCode,
                buyerName: row.buyer_name || row.name || 'Supabase Verified Buyer',
                email: row.email || '',
                orderId: row.order_id || '',
                paymentStatus: active ? 'Paid' : 'Revoked',
                createdAt: row.created_at || new Date().toISOString(),
                isActive: active,
                activated: Boolean(row.activated),
                source: 'Supabase'
              }
            };
          }
        }
      } catch (err) {
        console.warn('Supabase lookup skipped:', err);
      }
    }

    return { valid: false };
  },

  subscribeToLicenses(onUpdate: (licenses: IssuedPasscode[]) => void) {
    const colRef = collection(db, 'engine_licenses');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: IssuedPasscode[] = snapshot.docs.map(d => d.data() as IssuedPasscode);
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore licenses listener note:', error);
      }
    );
  },

  subscribeToOrders(onUpdate: (orders: EngineOrderRecord[]) => void) {
    const colRef = collection(db, 'engine_orders');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: EngineOrderRecord[] = snapshot.docs.map(d => d.data() as EngineOrderRecord);
        list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore orders listener note:', error);
      }
    );
  },

  async saveSettings(settings: EngineAppSettings): Promise<void> {
    const path = 'engine_settings/config';
    try {
      await setDoc(doc(db, 'engine_settings', 'config'), {
        id: 'config',
        priceTZS: Number(settings.priceTZS) || 25000,
        priceUSD: Number(settings.priceUSD) || 10,
        sellerWhatsApp: String(settings.sellerWhatsApp || '+255757895896').slice(0, 30),
        lipaNamba: String(settings.lipaNamba || '0757 895 896').slice(0, 30),
        lipaName: String(settings.lipaName || 'SARAH KAPUYA').slice(0, 100),
        selarCheckoutUrl: String(settings.selarCheckoutUrl || '').slice(0, 300),
        makeWebhookUrl: String(settings.makeWebhookUrl || '').slice(0, 300),
        supabaseProjectUrl: String(settings.supabaseProjectUrl || '').slice(0, 300),
        supabaseAnonKey: String(settings.supabaseAnonKey || '').slice(0, 300),
        guideTitle: String(settings.guideTitle || 'THE QUIET SALES ENGINE').slice(0, 120),
        adminPin: String(settings.adminPin || 'BB-ADMIN-2025').trim().toUpperCase().slice(0, 50),
        buyerReviews: Array.isArray(settings.buyerReviews)
          ? settings.buyerReviews.slice(0, 12).map(r => ({
              id: String(r.id || '').slice(0, 50),
              name: String(r.name || '').slice(0, 80),
              location: String(r.location || '').slice(0, 80),
              niche: String(r.niche || '').slice(0, 80),
              quote: String(r.quote || '').slice(0, 400),
              result: String(r.result || '').slice(0, 120)
            }))
          : [],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToSettings(onUpdate: (settings: EngineAppSettings) => void) {
    const docRef = doc(db, 'engine_settings', 'config');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const raw = snap.data() as Partial<EngineAppSettings>;
          onUpdate({
            ...DEFAULT_ENGINE_SETTINGS,
            ...raw,
            lipaNamba:
              !raw.lipaNamba || raw.lipaNamba.trim() === '895896'
                ? '0757 895 896'
                : raw.lipaNamba,
            lipaName:
              !raw.lipaName || raw.lipaName.trim() === 'BiasharaBase Services'
                ? 'SARAH KAPUYA'
                : raw.lipaName
          });
        }
      },
      (error) => {
        console.warn('Firestore settings listener note:', error);
      }
    );
  },

  async saveWorkspace(workspace: BuyerWorkspaceState): Promise<void> {
    const docId = sanitizeDocId(workspace.licenseCode);
    const path = `engine_workspaces/${docId}`;
    try {
      await setDoc(doc(db, 'engine_workspaces', docId), {
        id: docId,
        licenseCode: String(workspace.licenseCode).slice(0, 50),
        onboardingDone: Boolean(workspace.onboardingDone),
        startHereChecklist: workspace.startHereChecklist || {},
        completedSprintDays: workspace.completedSprintDays || {},
        offerWorksheet: workspace.offerWorksheet || {},
        scorecardRows: Array.isArray(workspace.scorecardRows) ? workspace.scorecardRows.slice(0, 20) : [],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async loadWorkspace(licenseCode: string): Promise<BuyerWorkspaceState | null> {
    const docId = sanitizeDocId(licenseCode);
    const path = `engine_workspaces/${docId}`;
    try {
      const snap = await getDoc(doc(db, 'engine_workspaces', docId));
      if (snap.exists()) {
        return snap.data() as BuyerWorkspaceState;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async triggerMakeWebhook(
    webhookUrl: string,
    payload: {
      event: 'order_created' | 'resend_access_email' | 'code_activated';
      buyerName: string;
      email: string;
      orderId: string;
      licenseCode: string;
      appLink: string;
      amount?: number;
      currency?: string;
      paymentMethod?: string;
    }
  ): Promise<boolean> {
    if (!webhookUrl || !webhookUrl.startsWith('https://')) return false;
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString()
        })
      });
      return res.ok;
    } catch (err) {
      console.warn('Make.com webhook dispatch note:', err);
      return false;
    }
  }
};
