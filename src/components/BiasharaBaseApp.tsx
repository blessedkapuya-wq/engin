import { useState, useEffect, useMemo, useRef } from 'react';
import {
  BIASHARA_META,
  BIASHARA_CHAPTERS,
  DAY_PROMPTS,
  INITIAL_METRIC_ROWS,
  STARTER_PRODUCT_NICHES,
  LAUNCH_SPRINT_DAYS,
  DAILY_ROUTINE_STEPS,
  DEFAULT_OFFER_WORKSHEET,
  START_HERE_CHECKLIST,
  TEMPLATE_VAULT_20,
  WHATSAPP_SCRIPTS_FULL,
  TANZANIAN_EXAMPLES,
  CASE_STUDIES,
  CONVERSATION_MAP_STAGES
} from '../data/biasharaGuideData';
import {
  WeeklyMetricRow,
  IssuedPasscode,
  EngineOrderRecord,
  EngineAppSettings,
  OfferWorksheetData,
  ScriptCategory,
  SocialPlatform,
  DayPrompt
} from '../types/biashara';
import {
  validatePasscode,
  isAdminKeyMatch,
  getAuthorizedPasscodes,
  saveAuthorizedPasscodes,
  revokePasscode,
  reactivatePasscode,
  getStoredUserLicense,
  saveUserLicenseSession,
  clearUserLicenseSession,
  UserLicenseSession
} from '../utils/security';
import {
  engineFirestoreService,
  DEFAULT_ENGINE_SETTINGS
} from '../services/engineFirestoreService';
import BiasharaSalesLanding from './BiasharaSalesLanding';
import SellerAdminDashboard from './SellerAdminDashboard';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowRight,
  Clock,
  TrendingUp,
  RotateCcw,
  Play,
  Pause,
  Download,
  Lock,
  Key,
  Shield,
  MessageSquare,
  Layers,
  Target,
  Map,
  Briefcase,
  FileText,
  Sparkles,
  Plus,
  X,
  AlertCircle,
  Globe
} from 'lucide-react';

type ViewMode = 'sales' | 'product' | 'admin';
type WorkspaceTab =
  | 'start_here'
  | 'build_offer'
  | 'post_generator'
  | 'template_vault'
  | 'whatsapp_scripts'
  | 'tz_examples'
  | 'conversation_map'
  | 'case_studies'
  | 'scorecard';

interface BiasharaBaseAppProps {
  onBackToApp?: () => void;
}

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeScorecard(rows: Partial<WeeklyMetricRow>[]): WeeklyMetricRow[] {
  if (!Array.isArray(rows) || rows.length === 0) return INITIAL_METRIC_ROWS;
  return rows.map((r, idx) => ({
    week: Number(r.week) || idx + 1,
    posts: Number(r.posts) || 0,
    replies: Number(r.replies) || 0,
    convos: Number(r.convos) || 0,
    asks: Number(r.asks) || 0,
    sales: Number(r.sales) || 0,
    oneThingToChange: String(r.oneThingToChange || '')
  }));
}

export default function BiasharaBaseApp(_props: BiasharaBaseAppProps) {
  const [activeUserLicense, setActiveUserLicense] = useState<UserLicenseSession | null>(() =>
    getStoredUserLicense()
  );

  // Cloud Settings, Licenses & Orders
  const [settings, setSettings] = useState<EngineAppSettings>(() => {
    const saved = loadLocal<Partial<EngineAppSettings>>('biashara_engine_settings', {});
    return {
      ...DEFAULT_ENGINE_SETTINGS,
      ...saved,
      lipaNamba:
        !saved.lipaNamba || saved.lipaNamba.trim() === '895896'
          ? '0757 895 896'
          : saved.lipaNamba,
      lipaName:
        !saved.lipaName || saved.lipaName.trim() === 'BiasharaBase Services'
          ? 'SARAH KAPUYA'
          : saved.lipaName
    };
  });
  const [cloudLicenses, setCloudLicenses] = useState<IssuedPasscode[]>(() => getAuthorizedPasscodes());
  const [cloudOrders, setCloudOrders] = useState<EngineOrderRecord[]>([]);

  // Active route mode
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('biashara_view_mode') as ViewMode | null;
      return saved === 'product' || saved === 'admin' ? saved : 'sales';
    } catch {
      return 'sales';
    }
  });

  // Buyer Onboarding & Workspace Tab state
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('start_here');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [startHereChecklist, setStartHereChecklist] = useState<Record<string, boolean>>(() =>
    loadLocal('biashara_start_here_checks', {})
  );
  const [completedSprintDays, setCompletedSprintDays] = useState<Record<number, boolean>>(() =>
    loadLocal('biashara_sprint_days', {})
  );
  const [completedCalendarDays, setCompletedCalendarDays] = useState<Record<number, boolean>>(() =>
    loadLocal('biashara_completed_days', {})
  );
  const [offerWorksheet, setOfferWorksheet] = useState<OfferWorksheetData>(() => ({
    ...DEFAULT_OFFER_WORKSHEET,
    ...loadLocal<Partial<OfferWorksheetData>>('biashara_offer_worksheet', {})
  }));
  const [scorecardRows, setScorecardRows] = useState<WeeklyMetricRow[]>(() =>
    normalizeScorecard(loadLocal<Partial<WeeklyMetricRow>[]>('biashara_metric_rows', INITIAL_METRIC_ROWS))
  );

  // Interactive Tool States
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);
  const [isCheatSheetModalOpen, setIsCheatSheetModalOpen] = useState(false);

  const [postPlatform, setPostPlatform] = useState<SocialPlatform>('whatsapp');
  const [postArchetypeFilter, setPostArchetypeFilter] = useState<
    'all' | 'pitfall' | 'question' | 'process' | 'opinion' | 'ask'
  >('all');
  const [selectedMatrixWeek, setSelectedMatrixWeek] = useState<number | 'all'>(1);
  const [selectedDayPrompt, setSelectedDayPrompt] = useState<DayPrompt | null>(null);

  const [vaultFilter, setVaultFilter] = useState<
    'all' | 'pitfall' | 'question' | 'process' | 'opinion' | 'ask'
  >('all');
  const [vaultLanguage, setVaultLanguage] = useState<'custom' | 'raw' | 'example'>('custom');

  const [scriptFilter, setScriptFilter] = useState<'all' | ScriptCategory>('all');
  const [activeMapStage, setActiveMapStage] = useState<number>(0);

  // 15-Minute Engagement Timer
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Unlock / Admin Prompt Modals
  const [unlockModalInfo, setUnlockModalInfo] = useState<{
    open: boolean;
    featureName: string;
    requireAdmin?: boolean;
  } | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showAdminNav, setShowAdminNav] = useState<boolean>(() => {
    try {
      return new URLSearchParams(window.location.search).get('admin') === '1';
    } catch {
      return false;
    }
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const appOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://engine.biasharabase.com';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Persist workspace locally
  useEffect(() => {
    try {
      localStorage.setItem('biashara_view_mode', viewMode);
    } catch (e) {
      console.error(e);
    }
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('biashara_start_here_checks', JSON.stringify(startHereChecklist));
      localStorage.setItem('biashara_sprint_days', JSON.stringify(completedSprintDays));
      localStorage.setItem('biashara_completed_days', JSON.stringify(completedCalendarDays));
      localStorage.setItem('biashara_offer_worksheet', JSON.stringify(offerWorksheet));
      localStorage.setItem('biashara_metric_rows', JSON.stringify(scorecardRows));
    } catch (e) {
      console.error(e);
    }
  }, [startHereChecklist, completedSprintDays, completedCalendarDays, offerWorksheet, scorecardRows]);

  // Debounced Firestore sync for logged-in buyer workspace
  const syncTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!activeUserLicense || activeUserLicense.isAdmin) return;
    if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);

    syncTimerRef.current = window.setTimeout(() => {
      engineFirestoreService
        .saveWorkspace({
          id: activeUserLicense.code,
          licenseCode: activeUserLicense.code,
          onboardingDone: Object.values(startHereChecklist).filter(Boolean).length >= 3,
          startHereChecklist,
          completedSprintDays,
          offerWorksheet,
          scorecardRows,
          updatedAt: new Date().toISOString()
        })
        .catch(() => {
          // Non-blocking background sync
        });
    }, 900);

    return () => {
      if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    };
  }, [
    activeUserLicense,
    startHereChecklist,
    completedSprintDays,
    offerWorksheet,
    scorecardRows
  ]);

  // 15-minute timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  // Initialize Cloud Firestore connection, listeners & URL ?key= magic link handling
  useEffect(() => {
    engineFirestoreService.initConnection();

    const unsubSettings = engineFirestoreService.subscribeToSettings(cloudSet => {
      setSettings(cloudSet);
      try {
        localStorage.setItem('biashara_engine_settings', JSON.stringify(cloudSet));
      } catch (e) {
        console.error(e);
      }
    });

    const unsubLicenses = engineFirestoreService.subscribeToLicenses(list => {
      if (list.length > 0) {
        setCloudLicenses(list);
        saveAuthorizedPasscodes(list);
      }
    });

    const unsubOrders = engineFirestoreService.subscribeToOrders(orders => {
      setCloudOrders(orders);
    });

    // Check URL magic key ?key=... or ?admin=1
    const params = new URLSearchParams(window.location.search);
    const urlKey =
      params.get('key') ||
      params.get('code') ||
      params.get('access') ||
      params.get('license');

    if (urlKey) {
      const clean = urlKey.trim().toUpperCase();
      (async () => {
        if (isAdminKeyMatch(clean, settings.adminPin)) {
          const adminSession: UserLicenseSession = {
            code: clean,
            buyerName: 'Admin',
            isAdmin: true,
            activatedAt: new Date().toISOString()
          };
          saveUserLicenseSession(adminSession);
          setActiveUserLicense(adminSession);
          setViewMode('admin');
          return;
        }

        const cloudCheck = await engineFirestoreService.verifyCodeInCloud(clean, settings);
        if (cloudCheck.revoked) return;
        if (cloudCheck.pending) {
          setUnlockModalInfo({
            open: true,
            featureName: 'Payment Verification Pending'
          });
          setCodeInput(clean);
          setCodeError(
            `Your payment reference is queued for verification on ${settings.lipaNamba}. Confirm via WhatsApp or check back shortly.`
          );
          return;
        }

        if (cloudCheck.valid || validatePasscode(clean, undefined, settings.adminPin)) {
          const parts = clean.split('-');
          const buyerName =
            cloudCheck.license?.buyerName || (parts.length >= 2 ? parts[1] : 'Member');
          const session: UserLicenseSession = {
            code: clean,
            buyerName,
            email: cloudCheck.license?.email || '',
            isAdmin: false,
            activatedAt: new Date().toISOString()
          };
          saveUserLicenseSession(session);
          setActiveUserLicense(session);
          setViewMode('product');
          setActiveTab('start_here');
          setShowOnboardingModal(true);

          engineFirestoreService.markLicenseActivated(clean, buyerName).catch(() => {});
          const savedWs = await engineFirestoreService.loadWorkspace(clean).catch(() => null);
          if (savedWs) {
            if (savedWs.startHereChecklist) setStartHereChecklist(savedWs.startHereChecklist);
            if (savedWs.completedSprintDays) setCompletedSprintDays(savedWs.completedSprintDays);
            if (savedWs.offerWorksheet) {
              setOfferWorksheet({ ...DEFAULT_OFFER_WORKSHEET, ...savedWs.offerWorksheet });
            }
            if (savedWs.scorecardRows) setScorecardRows(normalizeScorecard(savedWs.scorecardRows));
          }
        }
      })();
    } else if (params.get('admin') === '1') {
      setShowAdminNav(true);
      if (!activeUserLicense?.isAdmin) {
        setUnlockModalInfo({
          open: true,
          featureName: 'Seller Admin Dashboard',
          requireAdmin: true
        });
      } else {
        setViewMode('admin');
      }
    } else if (params.get('selar') === 'paid' || params.get('email')) {
      const selarEmail = params.get('email');
      if (selarEmail) {
        setCodeInput(selarEmail);
      }
      setUnlockModalInfo({
        open: true,
        featureName: 'Selar Order Confirmation (Enter Access Code or Purchase Email)'
      });
    }

    const handleFooterAdminTrigger = () => {
      setShowAdminNav(true);
      if (activeUserLicense?.isAdmin) {
        setViewMode('admin');
      } else {
        setUnlockModalInfo({
          open: true,
          featureName: 'Seller Admin Dashboard',
          requireAdmin: true
        });
      }
    };
    window.addEventListener('biashara-open-admin', handleFooterAdminTrigger);

    return () => {
      unsubSettings();
      unsubLicenses();
      unsubOrders();
      window.removeEventListener('biashara-open-admin', handleFooterAdminTrigger);
    };
  }, []);

  // Re-check active session if revoked in Firestore
  useEffect(() => {
    if (!activeUserLicense || activeUserLicense.isAdmin) return;
    const match = cloudLicenses.find(
      l => l.code.toUpperCase() === activeUserLicense.code.toUpperCase()
    );
    if (match && !match.isActive) {
      clearUserLicenseSession();
      setActiveUserLicense(null);
      setViewMode('sales');
    }
  }, [cloudLicenses, activeUserLicense]);

  const isUnlocked = useMemo(() => {
    if (!activeUserLicense) return false;
    return validatePasscode(activeUserLicense.code, cloudLicenses, settings.adminPin);
  }, [activeUserLicense, cloudLicenses, settings.adminPin]);

  const isAdmin = Boolean(activeUserLicense?.isAdmin);

  // Handlers for Checkout & Unlock
  const handleUnlockApp = async (licenseKey?: string, buyerName?: string, email?: string) => {
    if (!licenseKey) return;
    const clean = licenseKey.trim().toUpperCase();
    const isAdminKey = isAdminKeyMatch(clean, settings.adminPin);
    const session: UserLicenseSession = {
      code: clean,
      buyerName: buyerName || (isAdminKey ? 'Admin' : 'Member'),
      email: email || '',
      isAdmin: isAdminKey,
      activatedAt: new Date().toISOString()
    };
    saveUserLicenseSession(session);
    setActiveUserLicense(session);

    if (isAdminKey) {
      setShowAdminNav(true);
      setViewMode('admin');
      return;
    }

    setViewMode('product');
    setActiveTab('start_here');

    // Mark activated in Firestore + load prior workspace if returning buyer
    await engineFirestoreService.markLicenseActivated(clean, session.buyerName).catch(() => {});
    const existingWs = await engineFirestoreService.loadWorkspace(clean).catch(() => null);
    if (existingWs) {
      if (existingWs.startHereChecklist) setStartHereChecklist(existingWs.startHereChecklist);
      if (existingWs.completedSprintDays) setCompletedSprintDays(existingWs.completedSprintDays);
      if (existingWs.offerWorksheet) {
        setOfferWorksheet({ ...DEFAULT_OFFER_WORKSHEET, ...existingWs.offerWorksheet });
      }
      if (existingWs.scorecardRows) setScorecardRows(normalizeScorecard(existingWs.scorecardRows));
      setShowOnboardingModal(!existingWs.onboardingDone);
    } else {
      setShowOnboardingModal(true);
    }
  };

  const handleOrderCompleted = async (passcode: IssuedPasscode, order: EngineOrderRecord) => {
    await engineFirestoreService.saveLicense(passcode);
    await engineFirestoreService.saveOrder(order);
    setCloudLicenses(prev => [passcode, ...prev.filter(p => p.code !== passcode.code)]);
    setCloudOrders(prev => [order, ...prev.filter(o => o.id !== order.id)]);

    if (passcode.isActive && settings.makeWebhookUrl) {
      await engineFirestoreService.triggerMakeWebhook(settings.makeWebhookUrl, {
        event: 'order_created',
        buyerName: passcode.buyerName,
        email: passcode.email || '',
        orderId: order.id,
        licenseCode: passcode.code,
        appLink: `${appOrigin}/?key=${passcode.code}`,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: order.paymentMethod
      });
    }
  };

  const handleIssueFromAdmin = async (license: IssuedPasscode, order?: EngineOrderRecord) => {
    await engineFirestoreService.saveLicense(license);
    if (order) {
      await engineFirestoreService.saveOrder(order);
    }
    if (settings.makeWebhookUrl && license.email) {
      await engineFirestoreService.triggerMakeWebhook(settings.makeWebhookUrl, {
        event: 'order_created',
        buyerName: license.buyerName,
        email: license.email,
        orderId: license.orderId || '',
        licenseCode: license.code,
        appLink: `${appOrigin}/?key=${license.code}`,
        amount: license.amount,
        currency: license.currency,
        paymentMethod: license.paymentMethod
      });
    }
  };

  const handleApprovePendingLicense = async (license: IssuedPasscode) => {
    await engineFirestoreService.approvePendingOrderAndLicense(license.code, license.orderId);
    setCloudLicenses(prev =>
      prev.map(p =>
        p.code === license.code ? { ...p, isActive: true, paymentStatus: 'Paid' } : p
      )
    );
    if (license.orderId) {
      setCloudOrders(prev =>
        prev.map(o => (o.id === license.orderId ? { ...o, status: 'Paid' } : o))
      );
    }
    if (settings.makeWebhookUrl && license.email) {
      await engineFirestoreService.triggerMakeWebhook(settings.makeWebhookUrl, {
        event: 'order_created',
        buyerName: license.buyerName,
        email: license.email,
        orderId: license.orderId || '',
        licenseCode: license.code,
        appLink: `${appOrigin}/?key=${license.code}`,
        amount: license.amount,
        currency: license.currency,
        paymentMethod: license.paymentMethod
      });
    }
  };

  const handleToggleLicenseStatus = async (code: string, isActive: boolean) => {
    if (isActive) reactivatePasscode(code);
    else revokePasscode(code);
    await engineFirestoreService.updateLicenseStatus(code, isActive);
  };

  const handleResendEmail = async (
    license: IssuedPasscode
  ): Promise<{ dispatchedWebhook: boolean }> => {
    await engineFirestoreService.markEmailResent(license.code);
    let dispatchedWebhook = false;
    if (settings.makeWebhookUrl) {
      dispatchedWebhook = await engineFirestoreService.triggerMakeWebhook(settings.makeWebhookUrl, {
        event: 'resend_access_email',
        buyerName: license.buyerName,
        email: license.email || '',
        orderId: license.orderId || '',
        licenseCode: license.code,
        appLink: `${appOrigin}/?key=${license.code}`,
        amount: license.amount,
        currency: license.currency,
        paymentMethod: license.paymentMethod
      });
    }
    return { dispatchedWebhook };
  };

  const handleUpdateSettings = async (next: EngineAppSettings) => {
    setSettings(next);
    try {
      localStorage.setItem('biashara_engine_settings', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
    await engineFirestoreService.saveSettings(next);
  };

  const handleVerifyModalCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeInput.trim().toUpperCase();
    if (!clean) {
      setCodeError('Enter your access code.');
      return;
    }

    if (unlockModalInfo?.requireAdmin && !isAdminKeyMatch(clean, settings.adminPin)) {
      setCodeError('Seller Admin access requires your private Seller Admin Key.');
      return;
    }

    setIsVerifyingCode(true);
    setCodeError(null);
    try {
      if (isAdminKeyMatch(clean, settings.adminPin)) {
        setUnlockModalInfo(null);
        setCodeInput('');
        await handleUnlockApp(clean, 'Admin');
        return;
      }

      const cloudCheck = await engineFirestoreService.verifyCodeInCloud(codeInput.trim(), settings);
      if (cloudCheck.pending) {
        setCodeError(
          `Payment ref is still pending seller approval on ${settings.lipaNamba} (${settings.lipaName}). Send your M-Pesa/Tigo SMS proof via WhatsApp to unlock.`
        );
        return;
      }
      if (cloudCheck.revoked) {
        setCodeError('This access key was revoked. Contact support on WhatsApp.');
        return;
      }

      const resolvedCode = cloudCheck.license?.code || clean;
      if (
        cloudCheck.valid ||
        (!resolvedCode.includes('@') && validatePasscode(resolvedCode, cloudLicenses, settings.adminPin))
      ) {
        const parts = resolvedCode.split('-');
        const buyer = cloudCheck.license?.buyerName || (parts.length >= 2 ? parts[1] : 'Member');
        setUnlockModalInfo(null);
        setCodeInput('');
        await handleUnlockApp(resolvedCode, buyer, cloudCheck.license?.email || '');
        return;
      }

      setCodeError('Invalid code or email. Confirm the exact BB-... code from your receipt.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Interpolation Helper for Buyer's Customized Offer Worksheet
  const interpolateWithOffer = (rawText: string) => {
    return rawText
      .replace(/\[WHO\]/g, offerWorksheet.who || DEFAULT_OFFER_WORKSHEET.who)
      .replace(/\[PROBLEM\]/g, offerWorksheet.problem || DEFAULT_OFFER_WORKSHEET.problem)
      .replace(/\[OUTCOME\]/g, offerWorksheet.outcome || DEFAULT_OFFER_WORKSHEET.outcome)
      .replace(/\[DELIVERABLE\]/g, offerWorksheet.deliverable || DEFAULT_OFFER_WORKSHEET.deliverable)
      .replace(/\[PRODUCT\]/g, offerWorksheet.deliverable || settings.guideTitle)
      .replace(/\[WITHOUT\]/g, offerWorksheet.without || DEFAULT_OFFER_WORKSHEET.without)
      .replace(/\[PRICE_TZS\]/g, offerWorksheet.priceTZS || String(settings.priceTZS.toLocaleString()))
      .replace(/\[PRICE_USD\]/g, offerWorksheet.priceUSD || String(settings.priceUSD))
      .replace(/\[KEYWORD\]/g, offerWorksheet.ctaKeyword || DEFAULT_OFFER_WORKSHEET.ctaKeyword)
      .replace(/\[LIPA_NAMBA\]/g, settings.lipaNamba)
      .replace(/\[LIPA_NAME\]/g, settings.lipaName)
      .replace(/\[CHECKOUT_LINK\]/g, settings.selarCheckoutUrl || `${appOrigin}/#pricing-checkout`);
  };

  // Derived Customized Assets for Part 3 Workspace
  const customBioHook = `I help ${offerWorksheet.who} ${offerWorksheet.outcome} without ${offerWorksheet.without}.`;
  const customLaunchPost = `If you are tired of ${offerWorksheet.problem}, stop doing it the hard way.\n\nI built ${offerWorksheet.deliverable} specifically for ${offerWorksheet.who} who want to ${offerWorksheet.outcome} — without ${offerWorksheet.without}.\n\nPrice: TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}).\nReply "${offerWorksheet.ctaKeyword}" or DM me directly (${offerWorksheet.whatsappHandle}) to grab yours today.`;
  const customWhatsAppClose = `Hi! Thanks for reaching out about ${offerWorksheet.deliverable}.\n\nHere is how to get instant access today:\n• Inside Tanzania: Send TSh ${offerWorksheet.priceTZS} to ${settings.lipaNamba} (${settings.lipaName}) and reply with your confirmation SMS.\n• International Card: Pay $${offerWorksheet.priceUSD} USD via ${settings.selarCheckoutUrl || `${appOrigin}/#pricing-checkout`}.\n\nAs soon as confirmed, I'll send your access link right here in DMs!`;

  const customCheatSheetText = `THE QUIET SALES ENGINE — MY CUSTOMIZED ACTION CHEAT SHEET
=========================================================
Audience: ${offerWorksheet.who}
Core Problem: ${offerWorksheet.problem}
Outcome Delivered: ${offerWorksheet.outcome}
Deliverable: ${offerWorksheet.deliverable}
Without: ${offerWorksheet.without}
Pricing: TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD} USD)
Reply Keyword: ${offerWorksheet.ctaKeyword}

1. PROFILE BIO HOOK
-------------------
${customBioHook}

2. LAUNCH ANNOUNCEMENT POST
---------------------------
${customLaunchPost}

3. DM CLOSING SCRIPT
--------------------
${customWhatsAppClose}

4. MULTI-PLATFORM POSTS (READY TO COPY)
---------------------------------------
[Story / Status Slides]
[Slide 1] Struggling with ${offerWorksheet.problem}?
[Slide 2] You don't need ${offerWorksheet.without}. Use ${offerWorksheet.deliverable} built for ${offerWorksheet.who}.
[Slide 3] Grab it today for TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}). Reply "${offerWorksheet.ctaKeyword}" in DMs and I'll send you the link.

[Instagram Carousel]
[Slide 1 Cover] Stop losing customers over ${offerWorksheet.problem}
[Slide 2 Value] How ${offerWorksheet.who} can ${offerWorksheet.outcome} without ${offerWorksheet.without}:
1. Pinpoint the buyer bottleneck
2. Use ${offerWorksheet.deliverable}
3. Close via clear DM / Payment instructions
[Slide 3 CTA] Comment "${offerWorksheet.ctaKeyword}" or DM me for TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}).

[LinkedIn / Threads]
Most advice tells ${offerWorksheet.who} to chase endless video reels.
In practice, buyers paying TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}) want clarity—not entertainment.
Inside ${offerWorksheet.deliverable}, we help you ${offerWorksheet.outcome} without ${offerWorksheet.without}.
Drop "${offerWorksheet.ctaKeyword}" below or send a DM if you'd like the breakdown.
`;

  const handleDownloadCustomCheatSheet = () => {
    const blob = new Blob([customCheatSheetText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My-Quiet-Sales-Custom-Cheat-Sheet.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTabSwitch = (tab: WorkspaceTab) => {
    // Allow non-paid users on Product mode to inspect 'start_here' as preview, lock paid execution tabs cleanly
    if (!isUnlocked && tab !== 'start_here') {
      setUnlockModalInfo({
        open: true,
        featureName: 'Interactive Member Workspace Tabs'
      });
      return;
    }
    setActiveTab(tab);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Filtered Lists for Workspace Tabs
  const filteredVaultTemplates = TEMPLATE_VAULT_20.filter(
    t => vaultFilter === 'all' || t.archetype === vaultFilter
  );
  const filteredScripts = WHATSAPP_SCRIPTS_FULL.filter(
    s => scriptFilter === 'all' || s.category === scriptFilter
  );
  const filteredMatrixDays = DAY_PROMPTS.filter(d => {
    const matchWeek = selectedMatrixWeek === 'all' || d.week === selectedMatrixWeek;
    const matchType = postArchetypeFilter === 'all' || d.type === postArchetypeFilter;
    return matchWeek && matchType;
  });

  // Scorecard totals
  const scorecardTotals = useMemo(() => {
    return scorecardRows.reduce(
      (acc, r) => ({
        posts: acc.posts + (Number(r.posts) || 0),
        replies: acc.replies + (Number(r.replies) || 0),
        convos: acc.convos + (Number(r.convos) || 0),
        asks: acc.asks + (Number(r.asks) || 0),
        sales: acc.sales + (Number(r.sales) || 0)
      }),
      { posts: 0, replies: 0, convos: 0, asks: 0, sales: 0 }
    );
  }, [scorecardRows]);

  const workspaceTabs: { id: WorkspaceTab; label: string }[] = [
    { id: 'start_here', label: 'Start Here' },
    { id: 'build_offer', label: 'Build My Offer' },
    { id: 'post_generator', label: 'What Should I Post?' },
    { id: 'template_vault', label: 'Template Vault (20)' },
    { id: 'whatsapp_scripts', label: 'DM Scripts' },
    { id: 'tz_examples', label: 'Tanzanian Examples' },
    { id: 'conversation_map', label: 'Conversation Map' },
    { id: 'case_studies', label: 'Case Studies' },
    { id: 'scorecard', label: 'Weekly Scorecard' }
  ];

  const completedStartHereCount = START_HERE_CHECKLIST.filter(c => startHereChecklist[c.id]).length;

  return (
    <div className="flex-1 flex flex-col">
      {/* CLEAN 3-ZONE TOP BAR (Single-line controls, zero badge spam) */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white border-b border-stone-800 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setViewMode('sales')}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-sm flex items-center justify-center">
              Q
            </div>
            <span className="font-archivo font-black text-base tracking-tight uppercase text-white whitespace-nowrap">
              BiasharaBase
            </span>
          </button>

          {/* Zone 2: Concise Mode Links */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setViewMode('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-archivo font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                viewMode === 'sales'
                  ? 'bg-white text-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Sales Page
            </button>

            <button
              onClick={() => {
                setViewMode('product');
                if (!isUnlocked) {
                  setActiveTab('start_here');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-archivo font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                viewMode === 'product'
                  ? 'bg-white text-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Buyer Workspace
            </button>

            {(isAdmin || showAdminNav) && (
              <button
                onClick={() => {
                  if (isAdmin) {
                    setViewMode('admin');
                  } else {
                    setUnlockModalInfo({
                      open: true,
                      featureName: 'Seller Admin Dashboard',
                      requireAdmin: true
                    });
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-archivo font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  viewMode === 'admin'
                    ? 'bg-[#D2F803] text-black'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Seller Admin
              </button>
            )}
          </nav>

          {/* Zone 3: Single Primary CTA */}
          <div className="shrink-0">
            {isUnlocked ? (
              <button
                onClick={() => {
                  if (viewMode === 'sales') setViewMode(isAdmin ? 'admin' : 'product');
                  else setShowOnboardingModal(true);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAdmin ? 'Admin Active' : `Active: ${activeUserLicense?.buyerName}`}
              </button>
            ) : (
              <button
                onClick={() =>
                  setUnlockModalInfo({
                    open: true,
                    featureName: 'Full Workspace Unlock'
                  })
                }
                className="px-3.5 py-2 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0 hover:bg-[#bce002] cursor-pointer"
              >
                Enter Code
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PART 1: PUBLIC SALES PAGE */}
      {viewMode === 'sales' && (
        <BiasharaSalesLanding
          onUnlockApp={handleUnlockApp}
          onOrderCompleted={handleOrderCompleted}
          onOpenPreviewChapter={(idx) => {
            setSelectedChapterIdx(idx);
            setViewMode('product');
            setActiveTab('start_here');
            setIsPlaybookModalOpen(true);
          }}
          settings={settings}
          cloudLicenses={cloudLicenses}
        />
      )}

      {/* PART 4 & 5: PRIVATE SELLER ADMIN DASHBOARD */}
      {viewMode === 'admin' && isAdmin && (
        <SellerAdminDashboard
          licenses={cloudLicenses}
          orders={cloudOrders}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onIssueLicense={handleIssueFromAdmin}
          onToggleLicenseStatus={handleToggleLicenseStatus}
          onApprovePendingLicense={handleApprovePendingLicense}
          onResendEmail={handleResendEmail}
          onBackToSales={() => setViewMode('sales')}
          onOpenBuyerApp={() => {
            setViewMode('product');
            setActiveTab('start_here');
          }}
        />
      )}

      {viewMode === 'admin' && !isAdmin && (
        <div className="max-w-md mx-auto px-4 py-16 w-full">
          <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4 text-center">
            <Shield className="w-8 h-8 mx-auto text-stone-900" />
            <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
              Seller Admin Authentication Required
            </h2>
            <p className="text-xs text-stone-600">
              Enter your Master Admin Key to manage customers, access codes, pricing, and Selar/Make.com webhooks.
            </p>
            <button
              onClick={() =>
                setUnlockModalInfo({
                  open: true,
                  featureName: 'Seller Admin Dashboard',
                  requireAdmin: true
                })
              }
              className="w-full py-3 rounded-xl bg-[#111111] text-white font-archivo font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Enter Master Admin Key
            </button>
          </div>
        </div>
      )}

      {/* PART 2 & 3: INTERACTIVE BUYER WORKSPACE */}
      {viewMode === 'product' && (
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
          {/* Workspace Subheader + Offline Downloads */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-stone-500">
                {isUnlocked
                  ? `Member Workspace · Code ${activeUserLicense?.code}`
                  : 'Preview Mode · Enter your Access Code to unlock all 9 interactive tabs'}
              </p>
              <h1 className="font-archivo text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-900 mt-0.5">
                {settings.guideTitle}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {isUnlocked && (
                <>
                  <button
                    onClick={() => setIsCheatSheetModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Export My Custom Cheat Sheet
                  </button>
                  <button
                    onClick={() => setShowOnboardingModal(true)}
                    className="px-3.5 py-2 rounded-lg bg-stone-100 text-stone-900 border border-stone-300 text-xs font-archivo font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  >
                    Checklist ({completedStartHereCount}/{START_HERE_CHECKLIST.length})
                  </button>
                </>
              )}

              <a
                href="/The-Quiet-Sales-Engine-8-Chapters.pdf"
                download="The-Quiet-Sales-Engine-8-Chapters.pdf"
                className="px-3.5 py-2 rounded-lg bg-[#111111] text-white text-xs font-archivo font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#D2F803]" />
                Offline 8-Page PDF
              </a>
            </div>
          </div>

          {/* 9-TAB HORIZONTAL WORKSPACE NAVIGATION */}
          <div className="bg-white border border-stone-200 rounded-xl p-2 flex items-center gap-1.5 overflow-x-auto no-print">
            {workspaceTabs.map(tab => {
              const locked = !isUnlocked && tab.id !== 'start_here';
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-archivo font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {locked && <Lock className="w-3 h-3 text-stone-400" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: START HERE — THE 7-DAY PLAN & ONBOARDING CHECKLIST */}
          {activeTab === 'start_here' && (
            <div className="space-y-6">
              {/* Top Quick Orientation Banner */}
              <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-8 grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-2">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#D2F803]">
                    Step-by-Step Buyer Orientation · Zero Overwhelm
                  </p>
                  <h2 className="font-archivo text-2xl sm:text-3xl font-black uppercase">
                    Start Here: Your First 7 Days
                  </h2>
                  <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
                    Follow these 5 onboarding steps first, then execute Day 1 through Day 7 in order. Do not skip straight to posting links—your Offer Worksheet automatically powers your posts and DM scripts.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => handleTabSwitch('build_offer')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#D2F803] text-black font-archivo font-black text-xs uppercase tracking-wider hover:bg-[#bce002] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Step 1: Open Offer Builder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaybookModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl border border-stone-600 text-stone-200 font-archivo font-bold text-xs uppercase tracking-wider hover:border-white cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read 8-Chapter Playbook</span>
                  </button>
                </div>
              </div>

              {/* Start Here Checklist */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-archivo text-lg font-black uppercase text-stone-900">
                      Initial Setup Checklist ({completedStartHereCount}/{START_HERE_CHECKLIST.length} Complete)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Your progress saves automatically to your device and Cloud Firestore.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {START_HERE_CHECKLIST.map(step => {
                    const checked = Boolean(startHereChecklist[step.id]);
                    return (
                      <label
                        key={step.id}
                        className="py-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-stone-50 px-2 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setStartHereChecklist(prev => ({
                              ...prev,
                              [step.id]: !prev[step.id]
                            }))
                          }
                          className="w-5 h-5 mt-0.5 accent-black cursor-pointer"
                        />
                        <div>
                          <p className={`text-sm font-bold ${checked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-stone-600 mt-0.5">{step.detail}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 7-Day Launch Sprint Action Plan */}
              <div className="space-y-4">
                <h3 className="font-archivo text-xl font-black uppercase text-stone-900">
                  7-Day Quick-Start Execution Plan
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {LAUNCH_SPRINT_DAYS.map(day => {
                    const done = Boolean(completedSprintDays[day.day]);
                    const locked = !isUnlocked && day.day > 1;
                    return (
                      <div
                        key={day.day}
                        className={`bg-white border rounded-2xl p-5 space-y-3 ${
                          done ? 'border-emerald-500 bg-emerald-50/20' : 'border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-xs font-bold uppercase text-stone-500">
                              Day 0{day.day} · {day.focus} · {day.estimatedTime}
                            </p>
                            <h4 className="font-archivo text-base font-black text-stone-900 mt-0.5">
                              {day.title}
                            </h4>
                          </div>
                          {locked ? (
                            <button
                              onClick={() =>
                                setUnlockModalInfo({
                                  open: true,
                                  featureName: `Day ${day.day} Execution Plan`
                                })
                              }
                              className="px-2.5 py-1 rounded border border-stone-300 text-xs font-bold text-stone-600 flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Lock className="w-3 h-3" />
                              Locked
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setCompletedSprintDays(prev => ({
                                  ...prev,
                                  [day.day]: !prev[day.day]
                                }))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer shrink-0 ${
                                done
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-100 text-stone-800 hover:bg-[#D2F803]'
                              }`}
                            >
                              {done ? 'Done ✓' : 'Mark Done'}
                            </button>
                          )}
                        </div>

                        {!locked && (
                          <>
                            <ul className="space-y-1.5 text-xs text-stone-700 pt-1">
                              {day.checklist.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                              Deliverable: {day.keyDeliverable}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUILD MY OFFER — INTERACTIVE OFFER WORKSHEET */}
          {activeTab === 'build_offer' && isUnlocked && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-stone-500">
                      Interactive Customization Engine
                    </p>
                    <h2 className="font-archivo text-2xl font-black uppercase text-stone-900">
                      Build My Offer Worksheet
                    </h2>
                    <p className="text-sm text-stone-600 mt-0.5">
                      Every edit here immediately personalizes your Bio Hook, Post Generator, 20-Template Vault, and DM Scripts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheatSheetModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save My Custom Sheet
                  </button>
                </div>

                {/* Quick-Fill Niche Presets */}
                <div className="space-y-2">
                  <p className="font-mono text-xs font-bold uppercase text-stone-500">
                    Need inspiration? Quick-fill from a proven product model:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTER_PRODUCT_NICHES.slice(0, 6).map(niche => (
                      <button
                        key={niche.id}
                        type="button"
                        onClick={() =>
                          setOfferWorksheet(prev => ({
                            ...prev,
                            who: niche.targetBuyer,
                            problem: niche.problemSolved,
                            deliverable: niche.title,
                            priceTZS: niche.suggestedPriceTZS.toLocaleString(),
                            priceUSD: String(niche.suggestedPriceUSD)
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#D2F803] text-xs font-semibold text-stone-800 border border-stone-200 cursor-pointer transition-colors"
                      >
                        {niche.categoryLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      1. Exact Audience (Who do you help?)
                    </label>
                    <input
                      type="text"
                      value={offerWorksheet.who}
                      onChange={e => setOfferWorksheet(prev => ({ ...prev, who: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      2. Core Problem They Want Solved
                    </label>
                    <input
                      type="text"
                      value={offerWorksheet.problem}
                      onChange={e => setOfferWorksheet(prev => ({ ...prev, problem: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      3. Tangible Outcome They Get
                    </label>
                    <input
                      type="text"
                      value={offerWorksheet.outcome}
                      onChange={e => setOfferWorksheet(prev => ({ ...prev, outcome: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      4. Product / Service Deliverable
                    </label>
                    <input
                      type="text"
                      value={offerWorksheet.deliverable}
                      onChange={e => setOfferWorksheet(prev => ({ ...prev, deliverable: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      5. Obstacles Avoided ("Without...")
                    </label>
                    <input
                      type="text"
                      value={offerWorksheet.without}
                      onChange={e => setOfferWorksheet(prev => ({ ...prev, without: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Price (TSh)
                      </label>
                      <input
                        type="text"
                        value={offerWorksheet.priceTZS}
                        onChange={e => setOfferWorksheet(prev => ({ ...prev, priceTZS: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Price ($ USD)
                      </label>
                      <input
                        type="text"
                        value={offerWorksheet.priceUSD}
                        onChange={e => setOfferWorksheet(prev => ({ ...prev, priceUSD: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Reply Word
                      </label>
                      <input
                        type="text"
                        value={offerWorksheet.ctaKeyword}
                        onChange={e => setOfferWorksheet(prev => ({ ...prev, ctaKeyword: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg font-mono uppercase focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-Generated Customized Outputs */}
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="bg-white border-2 border-black rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-bold uppercase text-stone-500">
                      Generated Bio Hook
                    </p>
                    <p className="text-sm font-semibold text-stone-900 leading-relaxed">
                      {customBioHook}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(customBioHook, 'bio-copy')}
                    className="w-full py-2.5 rounded-lg bg-[#111111] text-white text-xs font-archivo font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'bio-copy' ? <Check className="w-3.5 h-3.5 text-[#D2F803]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'bio-copy' ? 'Bio Copied' : 'Copy Profile Bio'}
                  </button>
                </div>

                <div className="bg-white border-2 border-black rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-bold uppercase text-stone-500">
                      Generated Launch Post
                    </p>
                    <pre className="text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {customLaunchPost}
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(customLaunchPost, 'launch-post-copy')}
                    className="w-full py-2.5 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'launch-post-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'launch-post-copy' ? 'Launch Post Copied' : 'Copy Launch Post'}
                  </button>
                </div>

                <div className="bg-white border-2 border-black rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-bold uppercase text-stone-500">
                      Generated DM Closing Script
                    </p>
                    <pre className="text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {customWhatsAppClose}
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(customWhatsAppClose, 'wa-close-copy')}
                    className="w-full py-2.5 rounded-lg bg-[#111111] text-white text-xs font-archivo font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'wa-close-copy' ? <Check className="w-3.5 h-3.5 text-[#D2F803]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'wa-close-copy' ? 'Script Copied' : 'Copy Closing Message'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHAT SHOULD I POST? — DAILY POST GENERATOR & 15-MIN TIMER */}
          {activeTab === 'post_generator' && isUnlocked && (
            <div className="space-y-6">
              {/* Top Row: Customized Daily Post Generator + 15-Minute Timer */}
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <p className="font-mono text-xs uppercase text-stone-500">
                        Personalized from your Offer Worksheet
                      </p>
                      <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                        Today&apos;s Ready-to-Publish Post Generator
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(['whatsapp', 'threads', 'instagram', 'linkedin'] as SocialPlatform[]).map(plat => (
                        <button
                          key={plat}
                          onClick={() => setPostPlatform(plat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                            postPlatform === plat
                              ? 'bg-black text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {plat === 'whatsapp' ? 'DM / Story' : plat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <p className="font-mono text-[11px] font-bold uppercase text-stone-500">
                      Generated {postPlatform === 'whatsapp' ? 'DM / Story' : postPlatform} Post Copy
                    </p>
                    <pre className="text-sm text-stone-900 whitespace-pre-wrap font-sans leading-relaxed">
                      {postPlatform === 'whatsapp'
                        ? `[Slide 1] Struggling with ${offerWorksheet.problem}?\n[Slide 2] You don't need ${offerWorksheet.without}. Use ${offerWorksheet.deliverable} built for ${offerWorksheet.who}.\n[Slide 3] Grab it today for TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}). Reply "${offerWorksheet.ctaKeyword}" in DMs and I'll send you the link.`
                        : postPlatform === 'instagram'
                          ? `[Slide 1 Cover] Stop losing customers over ${offerWorksheet.problem}\n\n[Slide 2 Value] How ${offerWorksheet.who} can ${offerWorksheet.outcome} without ${offerWorksheet.without}:\n1. Pinpoint the buyer bottleneck\n2. Use ${offerWorksheet.deliverable}\n3. Close via clear DM / Payment instructions\n\n[Slide 3 CTA] Comment "${offerWorksheet.ctaKeyword}" or DM me for TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}).`
                          : postPlatform === 'linkedin'
                            ? `Most advice tells ${offerWorksheet.who} to chase endless video reels.\n\nIn practice, buyers paying TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}) want clarity—not entertainment.\n\nInside ${offerWorksheet.deliverable}, we focus on helping you ${offerWorksheet.outcome} without ${offerWorksheet.without}.\n\nDrop "${offerWorksheet.ctaKeyword}" below or DM me directly if you'd like the breakdown.`
                            : `Unpopular truth for ${offerWorksheet.who}:\n\nYou don't need ${offerWorksheet.without} to solve ${offerWorksheet.problem}.\n\nYou need ${offerWorksheet.deliverable} + 15 minutes of daily genuine replies.\n\nReply "${offerWorksheet.ctaKeyword}" if you want the exact setup.`}
                    </pre>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const text =
                          postPlatform === 'whatsapp'
                            ? `[Slide 1] Struggling with ${offerWorksheet.problem}?\n[Slide 2] You don't need ${offerWorksheet.without}. Use ${offerWorksheet.deliverable} built for ${offerWorksheet.who}.\n[Slide 3] Grab it today for TSh ${offerWorksheet.priceTZS} ($${offerWorksheet.priceUSD}). Reply "${offerWorksheet.ctaKeyword}" in DMs and I'll send you the link.`
                            : customLaunchPost;
                        copyToClipboard(text, 'daily-gen-copy');
                      }}
                      className="px-5 py-2.5 rounded-lg bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'daily-gen-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'daily-gen-copy' ? 'Copied to Clipboard' : 'Copy Generated Post'}
                    </button>
                  </div>
                </div>

                {/* 15-Minute Engagement Timer */}
                <div className="lg:col-span-4 bg-[#111111] text-white rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-[#D2F803]">
                      Daily Execution Timer
                    </p>
                    <h3 className="font-archivo text-lg font-black uppercase mt-0.5">
                      15-Min Reply Block
                    </h3>
                    <p className="font-mono text-4xl font-black text-white tabular-nums mt-3">
                      {formatTimer(timerSeconds)}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {DAILY_ROUTINE_STEPS.slice(0, 3).map((s, i) => (
                      <li key={i}>
                        <strong className="text-[#D2F803]">{s.time}:</strong> {s.action}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimerRunning(prev => !prev)}
                      className="flex-1 py-2.5 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {timerRunning ? 'Pause' : 'Start 15:00'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(15 * 60);
                      }}
                      className="px-3 py-2.5 rounded-lg border border-stone-600 text-stone-200 text-xs font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 45-Day Multi-Platform Calendar Matrix */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <h3 className="font-archivo text-lg font-black uppercase text-stone-900">
                    45-Day Multi-Platform Prompt Matrix
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedMatrixWeek(w)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          selectedMatrixWeek === w
                            ? 'bg-black text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        Wk {w}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedMatrixWeek('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        selectedMatrixWeek === 'all'
                          ? 'bg-black text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      All 45
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMatrixDays.map(day => {
                    const done = Boolean(completedCalendarDays[day.day]);
                    return (
                      <div
                        key={day.day}
                        className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 ${
                          done ? 'border-emerald-500 bg-emerald-50/20' : 'border-stone-200 bg-stone-50/50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-stone-500">
                              DAY {day.day} · {day.typeName}
                            </span>
                            <button
                              onClick={() =>
                                setCompletedCalendarDays(prev => ({
                                  ...prev,
                                  [day.day]: !prev[day.day]
                                }))
                              }
                              className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer ${
                                done ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300 text-stone-700'
                              }`}
                            >
                              {done ? 'Posted ✓' : 'Mark Done'}
                            </button>
                          </div>
                          <p className="text-xs text-stone-800 leading-relaxed line-clamp-4">
                            {day.template}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedDayPrompt(day)}
                          className="text-xs font-archivo font-bold uppercase text-stone-900 underline underline-offset-4 text-left cursor-pointer"
                        >
                          Open Full Prompt &amp; Example →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATE VAULT (ALL 20 TEXT-POST TEMPLATES) */}
          {activeTab === 'template_vault' && isUnlocked && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                    20-Template Text Vault
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Switch between customized templates (auto-filled from your Offer Worksheet), blank templates, or real market examples.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-stone-100 p-1 rounded-lg">
                    {(['custom', 'raw', 'example'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setVaultLanguage(mode)}
                        className={`px-3 py-1.5 rounded text-xs font-bold capitalize cursor-pointer ${
                          vaultLanguage === mode ? 'bg-black text-white' : 'text-stone-700'
                        }`}
                      >
                        {mode === 'custom'
                          ? 'Auto-Filled (Your Offer)'
                          : mode === 'example'
                            ? 'Market Example'
                            : 'Blank Template'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'all', label: 'All 20 Templates' },
                    { id: 'pitfall', label: 'Costly Mistakes' },
                    { id: 'question', label: 'Question Triggers' },
                    { id: 'process', label: 'Workflow Proof' },
                    { id: 'opinion', label: 'Contrarian Truths' },
                    { id: 'ask', label: 'Direct Weekly Offers' }
                  ] as const
                ).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setVaultFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer ${
                      vaultFilter === cat.id
                        ? 'bg-[#D2F803] text-black border border-black'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Template Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {filteredVaultTemplates.map(tpl => {
                  const displayText =
                    vaultLanguage === 'example'
                      ? tpl.tanzanianExample
                      : vaultLanguage === 'custom'
                        ? interpolateWithOffer(tpl.template)
                        : tpl.template;

                  return (
                    <div
                      key={tpl.id}
                      className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                          <span>
                            #{tpl.num} · {tpl.archetypeLabel}
                          </span>
                          <span>{tpl.bestFor}</span>
                        </div>
                        <h3 className="font-archivo text-lg font-black text-stone-900">
                          {tpl.title}
                        </h3>
                        <pre className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {displayText}
                        </pre>
                      </div>

                      <button
                        onClick={() => copyToClipboard(displayText, tpl.id)}
                        className="w-full py-2.5 rounded-lg bg-[#111111] text-white text-xs font-archivo font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:bg-stone-800"
                      >
                        {copiedKey === tpl.id ? (
                          <Check className="w-3.5 h-3.5 text-[#D2F803]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedKey === tpl.id ? 'Copied to Clipboard' : 'Copy Post Template'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: WHATSAPP SCRIPTS (STATUS, DM, FOLLOW-UP, CLOSING, OBJECTIONS) */}
          {activeTab === 'whatsapp_scripts' && isUnlocked && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <div>
                  <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                    DM Script Library
                  </h2>
                  <p className="text-sm text-stone-600 mt-0.5">
                    Ready-to-paste Direct Messages for Instagram, X/Threads, LinkedIn, Facebook &amp; WhatsApp — pre-filled automatically with your Offer deliverable, TSh/USD price, and checkout info.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'all', label: 'All DM Scripts' },
                      { id: 'status', label: 'Story & Status Slides' },
                      { id: 'dm', label: 'DM Openers' },
                      { id: 'followup', label: 'Follow-ups' },
                      { id: 'closing', label: 'Closing & Payment' },
                      { id: 'objection', label: 'Objections' }
                    ] as const
                  ).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setScriptFilter(cat.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer ${
                        scriptFilter === cat.id
                          ? 'bg-[#111111] text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {filteredScripts.map(script => {
                  const personalized = interpolateWithOffer(script.script);
                  return (
                    <div
                      key={script.id}
                      className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <p className="font-mono text-xs font-bold uppercase text-stone-500">
                          Category: {script.category} · {script.triggerScenario}
                        </p>
                        <h3 className="font-archivo text-lg font-black text-stone-900">
                          {script.title}
                        </h3>
                        <pre className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {personalized}
                        </pre>
                        <p className="text-xs text-stone-600">
                          <strong>Tip:</strong> {script.proTip}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(personalized, script.id)}
                        className="w-full py-2.5 rounded-lg bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#bce002]"
                      >
                        {copiedKey === script.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === script.id ? 'Copied Script' : 'Copy Customized Script'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: TANZANIAN EXAMPLES */}
          {activeTab === 'tz_examples' && isUnlocked && (
            <div className="space-y-6">
              <div>
                <h2 className="font-archivo text-2xl font-black uppercase text-stone-900">
                  Tanzanian Business Examples (TSh &amp; WhatsApp)
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Study how local creators and businesses structure TSh pricing and Lipa Namba conversations from first question to delivery.
                </p>
              </div>

              <div className="space-y-6">
                {TANZANIAN_EXAMPLES.map(ex => (
                  <div
                    key={ex.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 grid lg:grid-cols-12 gap-6"
                  >
                    <div className="lg:col-span-5 space-y-3">
                      <p className="font-mono text-xs font-bold uppercase text-stone-500">
                        {ex.city} · {ex.channel}
                      </p>
                      <h3 className="font-archivo text-xl font-black text-stone-900">
                        {ex.businessType}
                      </h3>
                      <p className="text-sm text-stone-700">
                        <strong>Offer:</strong> {ex.productSold}
                      </p>
                      <p className="font-mono text-lg font-black text-stone-950 tabular-nums">
                        Price: TSh {ex.priceTZS.toLocaleString()}
                      </p>
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 text-xs text-stone-700">
                        <strong className="block text-stone-900 mb-1">Post / Status Hook:</strong>
                        &ldquo;{ex.postHook}&rdquo;
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        Key Lesson: {ex.takeaway}
                      </p>
                    </div>

                    <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                      {ex.whatsappConversation.map((m, i) => (
                        <div
                          key={i}
                          className={`flex ${m.sender === 'Seller' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm ${
                              m.sender === 'Seller'
                                ? 'bg-[#111111] text-white'
                                : 'bg-white border border-stone-200 text-stone-800'
                            }`}
                          >
                            <p className={`font-mono text-[10px] uppercase mb-0.5 ${m.sender === 'Seller' ? 'text-[#D2F803]' : 'text-stone-400'}`}>
                              {m.sender}
                            </p>
                            <p>{m.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONVERSATION MAP (POST -> DM -> RECOMMENDATION -> PAYMENT -> DELIVERY) */}
          {activeTab === 'conversation_map' && isUnlocked && (
            <div className="space-y-6">
              <div>
                <h2 className="font-archivo text-2xl font-black uppercase text-stone-900">
                  The 5-Stage Sales Conversation Map
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Click any stage below to inspect the exact objective, script, and mistake to avoid from initial post to delivery.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CONVERSATION_MAP_STAGES.map((stage, idx) => (
                  <button
                    key={stage.step}
                    onClick={() => setActiveMapStage(idx)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      activeMapStage === idx
                        ? 'bg-[#111111] text-white border-black'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-black'
                    }`}
                  >
                    <p className={`font-mono text-xs font-bold ${activeMapStage === idx ? 'text-[#D2F803]' : 'text-stone-400'}`}>
                      STAGE {stage.step}
                    </p>
                    <p className="font-archivo font-black text-sm mt-1">
                      {stage.title.split(' (')[0]}
                    </p>
                  </button>
                ))}
              </div>

              {(() => {
                const st = CONVERSATION_MAP_STAGES[activeMapStage];
                return (
                  <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 space-y-5">
                    <div className="border-b border-stone-200 pb-4">
                      <p className="font-mono text-xs font-bold uppercase text-stone-500">
                        Stage {st.step} · Goal: {st.goal}
                      </p>
                      <h3 className="font-archivo text-2xl font-black text-stone-900 mt-1">
                        {st.title}
                      </h3>
                    </div>

                    <p className="text-base text-stone-700 leading-relaxed">{st.action}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                        <p className="font-mono text-xs font-bold uppercase text-stone-500">
                          Ready-to-Use Line
                        </p>
                        <p className="text-sm font-medium text-stone-900">
                          {interpolateWithOffer(st.exactLine)}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(interpolateWithOffer(st.exactLine), `map-${st.step}`)
                          }
                          className="text-xs font-bold underline cursor-pointer"
                        >
                          {copiedKey === `map-${st.step}` ? 'Copied ✓' : 'Copy Line'}
                        </button>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
                        <p className="font-mono text-xs font-bold uppercase text-red-700">
                          Mistake to Avoid
                        </p>
                        <p className="text-sm text-red-950">{st.mistakeToAvoid}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 8: CASE STUDIES (FREELANCER, FOOD BUSINESS, COACH) */}
          {activeTab === 'case_studies' && isUnlocked && (
            <div className="space-y-6">
              <div>
                <h2 className="font-archivo text-2xl font-black uppercase text-stone-900">
                  Case Studies: Freelancer, Food Business &amp; Coach
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Weekly execution routines and exact posts used to generate sales without filming Reels.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {CASE_STUDIES.map(cs => (
                  <div
                    key={cs.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <p className="font-mono text-xs font-bold uppercase text-stone-500">
                        {cs.archetype} · {cs.location}
                      </p>
                      <h3 className="font-archivo text-xl font-black text-stone-900">{cs.name}</h3>
                      <p className="text-xs text-stone-600">
                        <strong>Before:</strong> {cs.beforeState}
                      </p>
                      <p className="text-xs text-stone-700">
                        <strong>Change Made:</strong> {cs.changeMade}
                      </p>
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-1.5">
                        <p className="font-mono text-[11px] font-bold uppercase text-stone-500">
                          Weekly Routine
                        </p>
                        <ul className="text-xs text-stone-700 space-y-1">
                          {cs.weeklyRoutine.map((r, i) => (
                            <li key={i}>• {r}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs italic text-stone-700">
                        Key Post: {cs.keyPostUsed}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200">
                      <p className="font-archivo text-sm font-black text-stone-950 font-mono tabular-nums">
                        {cs.outcomeMetric}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{cs.timeframe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: WEEKLY SCORECARD */}
          {activeTab === 'scorecard' && isUnlocked && (
            <div className="space-y-6">
              {/* Totals Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: 'Total Posts', val: scorecardTotals.posts },
                  { label: 'Total Replies', val: scorecardTotals.replies },
                  { label: 'DM Conversations', val: scorecardTotals.convos },
                  { label: 'Enquiries (Asks)', val: scorecardTotals.asks },
                  { label: 'Completed Sales', val: scorecardTotals.sales }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-stone-500 uppercase">{stat.label}</p>
                    <p className="font-archivo text-2xl font-black text-stone-900 font-mono tabular-nums mt-1">
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                      Weekly Accountability Scorecard
                    </h2>
                    <p className="text-xs text-stone-500">
                      Track your weekly inputs and conversions. Saves automatically to Cloud Firestore.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setScorecardRows(prev => [
                          ...prev,
                          {
                            week: prev.length + 1,
                            posts: 0,
                            replies: 0,
                            convos: 0,
                            asks: 0,
                            sales: 0,
                            oneThingToChange: ''
                          }
                        ])
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#111111] text-white text-xs font-archivo font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D2F803]" />
                      Add Week
                    </button>
                    <button
                      onClick={() => setScorecardRows(INITIAL_METRIC_ROWS)}
                      className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:border-black cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-archivo font-bold uppercase text-stone-500">
                        <th className="py-3 px-3">Week</th>
                        <th className="py-3 px-3">Posts</th>
                        <th className="py-3 px-3">Replies</th>
                        <th className="py-3 px-3">Conversations</th>
                        <th className="py-3 px-3">Enquiries</th>
                        <th className="py-3 px-3">Sales</th>
                        <th className="py-3 px-3 min-w-[220px]">One Thing to Change Next Week</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-sm">
                      {scorecardRows.map((row, idx) => (
                        <tr key={row.week}>
                          <td className="py-3 px-3 font-mono font-bold text-stone-900">
                            Wk {row.week}
                          </td>
                          {(['posts', 'replies', 'convos', 'asks', 'sales'] as const).map(field => (
                            <td key={field} className="py-2.5 px-3">
                              <input
                                type="number"
                                min={0}
                                value={row[field]}
                                onChange={e => {
                                  const val = Number(e.target.value) || 0;
                                  setScorecardRows(prev =>
                                    prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
                                  );
                                }}
                                className="w-20 px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono tabular-nums text-sm focus:outline-none focus:border-black"
                              />
                            </td>
                          ))}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={row.oneThingToChange}
                              onChange={e => {
                                const text = e.target.value;
                                setScorecardRows(prev =>
                                  prev.map((r, i) =>
                                    i === idx ? { ...r, oneThingToChange: text } : r
                                  )
                                );
                              }}
                              placeholder="Note one bottleneck to fix..."
                              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-black"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* PART 2 MODAL: BUYER ONBOARDING WELCOME SCREEN & CHECKLIST */}
      {showOnboardingModal && isUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white border-2 border-black rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative my-8">
            <button
              onClick={() => setShowOnboardingModal(false)}
              aria-label="Close welcome guide"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-[#111111] text-white rounded-xl p-5 space-y-2">
              <p className="font-mono text-xs font-bold uppercase text-[#D2F803]">
                Welcome Inside · Buyer Onboarding
              </p>
              <h2 className="font-archivo text-2xl font-black uppercase">
                Welcome, {activeUserLicense?.buyerName || 'Member'}!
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Don&apos;t jump randomly through 100 templates. Follow these 5 Start Here steps and finish Day 1 of your 7-Day Launch Plan tonight.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase text-stone-500">
                  Your Personal Code
                </p>
                <p className="font-mono text-base font-black text-stone-900">
                  {activeUserLicense?.code}
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${appOrigin}/?key=${activeUserLicense?.code}`,
                    'onboard-magic-link'
                  )
                }
                className="px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedKey === 'onboard-magic-link' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedKey === 'onboard-magic-link' ? 'Link Copied' : 'Copy Re-Entry Link'}
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-archivo text-xs font-black uppercase text-stone-900">
                Your 5-Step Start Here Checklist
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {START_HERE_CHECKLIST.map(step => (
                  <label
                    key={step.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(startHereChecklist[step.id])}
                      onChange={() =>
                        setStartHereChecklist(prev => ({
                          ...prev,
                          [step.id]: !prev[step.id]
                        }))
                      }
                      className="w-4 h-4 mt-0.5 accent-black"
                    />
                    <span className="text-xs font-semibold text-stone-800">{step.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => {
                  setShowOnboardingModal(false);
                  setActiveTab('build_offer');
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase tracking-wider hover:bg-[#bce002] cursor-pointer"
              >
                Step 1: Customize My Offer →
              </button>
              <button
                onClick={() => {
                  setShowOnboardingModal(false);
                  setActiveTab('start_here');
                }}
                className="py-3.5 px-5 rounded-xl border border-stone-300 text-stone-800 font-archivo font-bold text-xs uppercase cursor-pointer"
              >
                Open 7-Day Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PLAYBOOK 8-CHAPTER READER MODAL */}
      {isPlaybookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <p className="font-mono text-xs uppercase text-stone-500">
                  8-Chapter Curriculum · Read Tonight in 25 Minutes
                </p>
                <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                  {settings.guideTitle} Playbook
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/The-Quiet-Sales-Engine-8-Chapters.pdf"
                  download="The-Quiet-Sales-Engine-8-Chapters.pdf"
                  className="px-3 py-1.5 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save PDF
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setIsPlaybookModalOpen(false)}
                  aria-label="Close playbook"
                  className="p-1.5 text-stone-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="flex flex-wrap gap-1.5">
              {BIASHARA_CHAPTERS.map((ch, idx) => {
                const locked = !isUnlocked && idx > 0;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      if (locked) {
                        setIsPlaybookModalOpen(false);
                        setUnlockModalInfo({
                          open: true,
                          featureName: `Chapter ${ch.num}`
                        });
                        return;
                      }
                      setSelectedChapterIdx(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer flex items-center gap-1 ${
                      selectedChapterIdx === idx
                        ? 'bg-black text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {locked && <Lock className="w-3 h-3" />}
                    <span>Ch {ch.num}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Chapter Content */}
            {(() => {
              const ch = BIASHARA_CHAPTERS[selectedChapterIdx] || BIASHARA_CHAPTERS[0];
              return (
                <div className="space-y-5">
                  <div>
                    <p className="font-mono text-xs text-stone-500 uppercase">
                      Chapter {ch.num} · {ch.readTime}
                    </p>
                    <h3 className="font-archivo text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                      {ch.title}{' '}
                      <span className="bg-[#D2F803] px-1.5 text-black">
                        {ch.highlightWords.join(' ')}
                      </span>
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">{ch.subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    {ch.corePoints.map(pt => (
                      <div key={pt.num} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                        <p className="font-archivo font-black text-sm text-stone-900">
                          {pt.num}. {pt.headline}
                        </p>
                        <p className="text-sm text-stone-700 mt-1 leading-relaxed">{pt.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#111111] text-white rounded-xl p-5 space-y-2">
                    <p className="font-mono text-xs uppercase text-[#D2F803]">
                      Action Step: {ch.doThisNow.title}
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-stone-200">
                      {ch.doThisNow.steps.map((s, i) => (
                        <li key={i}>
                          {i + 1}. {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* DAY PROMPT DETAIL MODAL */}
      {selectedDayPrompt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedDayPrompt(null)}
              aria-label="Close prompt detail"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="font-mono text-xs font-bold uppercase text-stone-500">
              Day {selectedDayPrompt.day} · {selectedDayPrompt.typeName}
            </p>
            <h3 className="font-archivo text-lg font-black text-stone-900">
              Ready-to-Post Prompt &amp; Example
            </h3>
            <pre className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
              {interpolateWithOffer(selectedDayPrompt.template)}
            </pre>
            <div className="bg-stone-900 text-stone-200 rounded-xl p-4 text-xs">
              <p className="font-bold text-[#D2F803] mb-1">Example Implementation</p>
              <p>{selectedDayPrompt.example}</p>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  interpolateWithOffer(selectedDayPrompt.template),
                  `day-${selectedDayPrompt.day}`
                )
              }
              className="w-full py-3 rounded-xl bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase cursor-pointer"
            >
              {copiedKey === `day-${selectedDayPrompt.day}` ? 'Copied ✓' : 'Copy Personalized Post'}
            </button>
          </div>
        </div>
      )}

      {/* UNLOCK / ADMIN CODE MODAL */}
      {unlockModalInfo?.open && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              onClick={() => {
                setUnlockModalInfo(null);
                setCodeError(null);
              }}
              aria-label="Close unlock prompt"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <p className="font-mono text-xs font-bold uppercase text-stone-500">
                {unlockModalInfo.requireAdmin ? 'Private Seller Access' : 'Access Verification'}
              </p>
              <h3 className="font-archivo text-xl font-black uppercase text-stone-900 mt-0.5">
                {unlockModalInfo.requireAdmin
                  ? 'Enter Master Admin Key'
                  : `Unlock ${unlockModalInfo.featureName}`}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {unlockModalInfo.requireAdmin
                  ? 'Enter your seller Master Admin Key to manage customers, payments, and integrations.'
                  : 'Enter your personal access code from email/WhatsApp, or return to the sales page to purchase.'}
              </p>
            </div>

            <form onSubmit={handleVerifyModalCode} className="space-y-4">
              <input
                type="text"
                value={codeInput}
                onChange={e => {
                  setCodeInput(e.target.value);
                  setCodeError(null);
                }}
                placeholder={unlockModalInfo.requireAdmin ? 'BB-ADMIN-2025' : 'BB-XXXX-0000-X0'}
                className="w-full px-4 py-3 border-2 border-stone-300 rounded-xl font-mono text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-black"
              />
              {codeError && (
                <p className="text-xs font-semibold text-red-600 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{codeError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifyingCode}
                className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-archivo font-black text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
              >
                {isVerifyingCode ? 'Verifying...' : 'Verify & Open'}
              </button>
            </form>

            {!unlockModalInfo.requireAdmin && (
              <button
                onClick={() => {
                  setUnlockModalInfo(null);
                  setViewMode('sales');
                }}
                className="w-full py-2 text-xs font-bold text-stone-600 hover:text-black underline cursor-pointer"
              >
                Need an access code? Go to Sales Page &amp; Payment Options
              </button>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMIZED ACTION CHEAT SHEET PRINT / DOWNLOAD MODAL */}
      {isCheatSheetModalOpen && isUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 no-print">
              <div>
                <p className="font-mono text-xs uppercase text-stone-500">
                  Personalized Export · Built From Your Offer Worksheet
                </p>
                <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
                  My Custom Offer + 7-Day Posts Cheat Sheet
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCustomCheatSheet}
                  className="px-3.5 py-2 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .TXT
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(customCheatSheetText, 'full-cheat-sheet')}
                  className="px-3.5 py-2 rounded-lg bg-[#111111] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'full-cheat-sheet' ? <Check className="w-3.5 h-3.5 text-[#D2F803]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'full-cheat-sheet' ? 'Copied All' : 'Copy All'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setIsCheatSheetModalOpen(false)}
                  aria-label="Close cheat sheet"
                  className="p-1.5 text-stone-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <pre className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs sm:text-sm text-stone-900 whitespace-pre-wrap font-mono leading-relaxed">
              {customCheatSheetText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
