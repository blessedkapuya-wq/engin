import { useState, useMemo } from 'react';
import {
  IssuedPasscode,
  EngineOrderRecord,
  EngineAppSettings,
  BuyerProofQuote
} from '../types/biashara';
import { issueNewPasscode } from '../utils/security';
import { engineFirestoreService } from '../services/engineFirestoreService';
import {
  Search,
  Key,
  Mail,
  Check,
  Copy,
  RefreshCw,
  Plus,
  Users,
  CheckCircle2,
  Shield,
  Globe,
  Sliders,
  Send,
  ExternalLink,
  AlertCircle,
  Lock,
  Unlock,
  Download,
  MessageSquare,
  Trash2
} from 'lucide-react';

interface SellerAdminDashboardProps {
  licenses: IssuedPasscode[];
  orders: EngineOrderRecord[];
  settings: EngineAppSettings;
  onUpdateSettings: (next: EngineAppSettings) => Promise<void>;
  onIssueLicense: (license: IssuedPasscode, order?: EngineOrderRecord) => Promise<void>;
  onToggleLicenseStatus: (code: string, isActive: boolean) => Promise<void>;
  onApprovePendingLicense: (license: IssuedPasscode) => Promise<void>;
  onResendEmail: (license: IssuedPasscode) => Promise<{ dispatchedWebhook: boolean }>;
  onBackToSales: () => void;
  onOpenBuyerApp: () => void;
}

type AdminSubTab = 'customers' | 'pricing' | 'automation';
type StatusFilter = 'all' | 'pending_payment' | 'active' | 'activated' | 'pending' | 'revoked';

export default function SellerAdminDashboard({
  licenses,
  orders,
  settings,
  onUpdateSettings,
  onIssueLicense,
  onToggleLicenseStatus,
  onApprovePendingLicense,
  onResendEmail,
  onBackToSales,
  onOpenBuyerApp
}: SellerAdminDashboardProps) {
  const [subTab, setSubTab] = useState<AdminSubTab>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create customer access code state
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerEmail, setNewBuyerEmail] = useState('');
  const [newOrderId, setNewOrderId] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('M-Pesa Lipa Namba');
  const [newCurrency, setNewCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [newAmount, setNewAmount] = useState<string>(String(settings.priceTZS || 25000));
  const [isIssuing, setIsIssuing] = useState(false);
  const [recentlyIssued, setRecentlyIssued] = useState<IssuedPasscode | null>(null);
  const [approvingCode, setApprovingCode] = useState<string | null>(null);

  // Action feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingCode, setResendingCode] = useState<string | null>(null);
  const [resentSuccessCode, setResentSuccessCode] = useState<string | null>(null);
  const [emailPreviewLicense, setEmailPreviewLicense] = useState<IssuedPasscode | null>(null);

  // Settings form state
  const [draftSettings, setDraftSettings] = useState<EngineAppSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedBanner, setSettingsSavedBanner] = useState(false);

  // Buyer Proof Review Draft
  const [revName, setRevName] = useState('');
  const [revLocation, setRevLocation] = useState('Dar es Salaam');
  const [revNiche, setRevNiche] = useState('');
  const [revResult, setRevResult] = useState('');
  const [revQuote, setRevQuote] = useState('');

  // Webhook test state
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');

  const appOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://engine.biasharabase.com';

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const pendingPaymentLicenses = useMemo(
    () => licenses.filter(l => !l.isActive && l.paymentStatus === 'Pending'),
    [licenses]
  );

  // Summary metrics
  const stats = useMemo(() => {
    const activeCount = licenses.filter(l => l.isActive).length;
    const pendingPaymentCount = licenses.filter(l => !l.isActive && l.paymentStatus === 'Pending').length;
    const revokedCount = licenses.filter(l => !l.isActive && l.paymentStatus !== 'Pending').length;
    const activatedCount = licenses.filter(l => Boolean(l.activated)).length;

    let totalTZS = 0;
    let totalUSD = 0;

    if (orders.length > 0) {
      orders
        .filter(o => o.status === 'Paid')
        .forEach(o => {
          if (o.currency === 'USD') totalUSD += Number(o.amount) || 0;
          else totalTZS += Number(o.amount) || 0;
        });
    } else {
      licenses
        .filter(l => l.isActive)
        .forEach(l => {
          if (l.currency === 'USD') totalUSD += Number(l.amount) || 0;
          else totalTZS += Number(l.amount) || 0;
        });
    }

    return {
      totalCustomers: licenses.length,
      activeCount,
      pendingPaymentCount,
      revokedCount,
      activatedCount,
      activationRate: activeCount > 0 ? Math.round((activatedCount / activeCount) * 100) : 0,
      totalTZS,
      totalUSD
    };
  }, [licenses, orders]);

  const filteredLicenses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return licenses.filter(item => {
      const isPendingPay = !item.isActive && item.paymentStatus === 'Pending';
      if (statusFilter === 'pending_payment' && !isPendingPay) return false;
      if (statusFilter === 'active' && !item.isActive) return false;
      if (statusFilter === 'revoked' && (item.isActive || isPendingPay)) return false;
      if (statusFilter === 'activated' && !item.activated) return false;
      if (statusFilter === 'pending' && (!item.isActive || item.activated)) return false;

      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.buyerName.toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.orderId || '').toLowerCase().includes(q) ||
        (item.notes || '').toLowerCase().includes(q)
      );
    });
  }, [licenses, searchQuery, statusFilter]);

  const handleCurrencyToggle = (currency: 'TZS' | 'USD') => {
    setNewCurrency(currency);
    setNewAmount(
      currency === 'USD'
        ? String(settings.priceUSD || 10)
        : String(settings.priceTZS || 25000)
    );
  };

  const handleCreateCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyerName.trim()) return;
    setIsIssuing(true);
    try {
      const amountNum = Number(newAmount) || (newCurrency === 'USD' ? settings.priceUSD : settings.priceTZS);
      const orderRef = newOrderId.trim() || `ORD-${Date.now().toString().slice(-6)}`;
      const issued = issueNewPasscode(
        newBuyerName,
        `${newPaymentMethod} · Order ${orderRef}`,
        {
          email: newBuyerEmail.trim(),
          orderId: orderRef,
          paymentMethod: newPaymentMethod,
          amount: amountNum,
          currency: newCurrency,
          source: newPaymentMethod.toLowerCase().includes('selar') ? 'Selar' : 'Admin Dashboard'
        }
      );

      const orderRecord: EngineOrderRecord = {
        id: orderRef,
        buyerName: issued.buyerName,
        email: issued.email || '',
        amount: amountNum,
        currency: newCurrency,
        paymentMethod: newPaymentMethod,
        referenceId: orderRef,
        licenseCode: issued.code,
        timestamp: issued.createdAt,
        status: 'Paid',
        source: issued.source || 'Admin Dashboard'
      };

      await onIssueLicense(issued, orderRecord);
      setRecentlyIssued(issued);
      setNewBuyerName('');
      setNewBuyerEmail('');
      setNewOrderId('');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleTriggerResendEmail = async (item: IssuedPasscode) => {
    setResendingCode(item.code);
    try {
      await onResendEmail(item);
      setResentSuccessCode(item.code);
      setEmailPreviewLicense(item);
      setTimeout(() => setResentSuccessCode(null), 4000);
    } finally {
      setResendingCode(null);
    }
  };

  const handleApprovePending = async (item: IssuedPasscode) => {
    setApprovingCode(item.code);
    try {
      await onApprovePendingLicense(item);
    } finally {
      setApprovingCode(null);
    }
  };

  const handleAddBuyerReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revQuote.trim()) return;
    const newReview: BuyerProofQuote = {
      id: `rev-${Date.now()}`,
      name: revName.trim(),
      location: revLocation.trim() || 'Tanzania',
      niche: revNiche.trim() || 'Verified Buyer',
      result: revResult.trim() || 'Confirmed Customer',
      quote: revQuote.trim()
    };
    const updatedReviews = [newReview, ...(draftSettings.buyerReviews || [])].slice(0, 12);
    const nextSettings = { ...draftSettings, buyerReviews: updatedReviews };
    setDraftSettings(nextSettings);
    await onUpdateSettings(nextSettings);
    setRevName('');
    setRevNiche('');
    setRevResult('');
    setRevQuote('');
  };

  const handleRemoveBuyerReview = async (id: string) => {
    const updatedReviews = (draftSettings.buyerReviews || []).filter(r => r.id !== id);
    const nextSettings = { ...draftSettings, buyerReviews: updatedReviews };
    setDraftSettings(nextSettings);
    await onUpdateSettings(nextSettings);
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await onUpdateSettings(draftSettings);
      setSettingsSavedBanner(true);
      setTimeout(() => setSettingsSavedBanner(false), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTestMakeWebhook = async () => {
    if (!draftSettings.makeWebhookUrl.trim()) return;
    setIsTestingWebhook(true);
    setWebhookTestResult('idle');
    const ok = await engineFirestoreService.triggerMakeWebhook(draftSettings.makeWebhookUrl.trim(), {
      event: 'order_created',
      buyerName: 'Test Buyer',
      email: 'testbuyer@example.com',
      orderId: `TEST-${Date.now().toString().slice(-5)}`,
      licenseCode: 'BB-TESTBYR-1024-K4',
      appLink: `${appOrigin}/?key=BB-TESTBYR-1024-K4`,
      amount: draftSettings.priceUSD,
      currency: 'USD',
      paymentMethod: 'Selar Card (Webhook Test)'
    });
    setWebhookTestResult(ok ? 'ok' : 'fail');
    setIsTestingWebhook(false);
  };

  const buildWelcomeEmailText = (item: IssuedPasscode) => {
    const magicLink = `${appOrigin}/?key=${item.code}`;
    const pdfLink = `${appOrigin}/The-Quiet-Sales-Engine-8-Chapters.pdf`;
    return `Subject: Your Access Code for ${settings.guideTitle} (${item.code})

Hello ${item.buyerName},

Thank you for purchasing ${settings.guideTitle}! Your payment has been confirmed.

HERE ARE YOUR PERSONAL ACCESS CREDENTIALS:
• Personal Access Code: ${item.code}
• Direct App Login Link: ${magicLink}
• 8-Page Offline PDF Playbook: ${pdfLink}

HOW TO START IN 3 MINUTES:
1. Tap the Direct App Login Link above — your paid workspace unlocks automatically.
2. Complete the "Start Here" checklist first so you do not feel lost.
3. Open "Build My Offer" to customize your offer, post prompts, and DM closing scripts.

Need help? Reply to this email or message us on WhatsApp: ${settings.sellerWhatsApp}

— ${settings.lipaName || 'BiasharaBase'}`;
  };

  const supabaseSqlSchema = `CREATE TABLE IF NOT EXISTS public.licenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text UNIQUE NOT NULL,
  buyer_name text NOT NULL,
  email text NOT NULL,
  access_code text UNIQUE NOT NULL,
  amount numeric DEFAULT ${draftSettings.priceUSD},
  currency text DEFAULT 'USD',
  payment_source text DEFAULT 'selar',
  status text DEFAULT 'paid',
  is_active boolean DEFAULT true,
  activated boolean DEFAULT false,
  activated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Allow public read check for license code verification
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read by access_code" ON public.licenses
  FOR SELECT USING (true);`;

  const makePayloadSpec = `{
  "event": "selar.order.completed",
  "buyer_name": "{{customer.full_name}}",
  "email": "{{customer.email}}",
  "order_id": "{{order.reference}}",
  "amount": "{{order.amount}}",
  "currency": "{{order.currency}}",
  "generated_code": "BB-{{upper(substring(replace(customer.full_name, ' ', ''), 0, 6))}}-{{random(1000,9999)}}-A7",
  "app_link": "${appOrigin}/?key={{generated_code}}",
  "pdf_link": "${appOrigin}/The-Quiet-Sales-Engine-8-Chapters.pdf"
}`;

  const workerProxyCode = `export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetHost = "${appOrigin.replace(/^https?:\/\//, '')}";
    url.hostname = targetHost;
    url.protocol = "https:";
    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      redirect: "follow"
    });
    return fetch(modifiedRequest);
  }
};`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Admin Header Strip */}
      <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#D2F803] mb-2">
            Seller Admin Console · Master Key Active
          </p>
          <h1 className="font-archivo text-2xl sm:text-3xl font-black uppercase tracking-tight">
            {settings.guideTitle} — Seller Operations
          </h1>
          <p className="text-sm text-stone-300 mt-1 max-w-2xl">
            Track paid customers, verify code activations, issue or revoke access keys, resend welcome emails, and configure Selar, Make.com &amp; Supabase automation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenBuyerApp}
            className="px-4 py-2.5 rounded-lg border border-stone-700 text-xs font-archivo font-bold uppercase tracking-wider text-stone-200 hover:border-white hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Open Buyer Workspace
          </button>
          <button
            onClick={onBackToSales}
            className="px-4 py-2.5 rounded-lg bg-[#D2F803] text-black text-xs font-archivo font-black uppercase tracking-wider hover:bg-[#bce002] transition-colors whitespace-nowrap cursor-pointer"
          >
            View Public Sales Page
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Revenue Recorded</p>
          <p className="font-archivo text-2xl font-black text-stone-900 mt-2 font-mono tabular-nums">
            TSh {stats.totalTZS.toLocaleString()}
          </p>
          <p className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
            + ${stats.totalUSD.toLocaleString()} USD
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Customers</p>
          <p className="font-archivo text-2xl font-black text-stone-900 mt-2 font-mono tabular-nums">
            {stats.totalCustomers}
          </p>
          <p className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
            {stats.activeCount} active · {stats.revokedCount} revoked
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Activated Codes</p>
          <p className="font-archivo text-2xl font-black text-stone-900 mt-2 font-mono tabular-nums">
            {stats.activatedCount} / {stats.totalCustomers}
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1 font-mono tabular-nums">
            {stats.activationRate}% buyer activation rate
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Live Checkout Price</p>
          <p className="font-archivo text-2xl font-black text-stone-900 mt-2 font-mono tabular-nums">
            TSh {settings.priceTZS.toLocaleString()}
          </p>
          <p className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
            ${settings.priceUSD} USD International
          </p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('customers')}
            className={`px-4 py-2 rounded-lg text-xs font-archivo font-black uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'customers'
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Customers &amp; Access Codes
          </button>
          <button
            onClick={() => setSubTab('pricing')}
            className={`px-4 py-2 rounded-lg text-xs font-archivo font-black uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'pricing'
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Price, WhatsApp &amp; Checkout Links
          </button>
          <button
            onClick={() => setSubTab('automation')}
            className={`px-4 py-2 rounded-lg text-xs font-archivo font-black uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'automation'
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            Selar · Make · Supabase · Domain
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CUSTOMERS & ACCESS CODES */}
      {subTab === 'customers' && (
        <div className="space-y-5">
          {/* Pending Mobile Money Verification Queue */}
          {pendingPaymentLicenses.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-amber-900">
                    Action Needed · {pendingPaymentLicenses.length} Mobile Money Payment{pendingPaymentLicenses.length > 1 ? 's' : ''} Waiting Confirmation
                  </p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Verify the SMS receipt on {settings.lipaNamba} ({settings.lipaName}) first, then tap <strong>Approve &amp; Issue Code</strong> to unlock access.
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                {pendingPaymentLicenses.map(item => {
                  const magicUrl = `${appOrigin}/?key=${item.code}`;
                  return (
                    <div
                      key={item.code}
                      className="bg-white border border-amber-200 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 text-xs">
                        <p className="font-bold text-stone-900">
                          {item.buyerName}{' '}
                          <span className="font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded ml-1">
                            Ref: {item.orderId || 'N/A'}
                          </span>
                        </p>
                        <p className="text-stone-600 font-mono">
                          {item.notes || item.paymentMethod} · Code: {item.code}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApprovePending(item)}
                          disabled={approvingCode === item.code}
                          className="px-3.5 py-2 rounded-lg bg-[#D2F803] text-black border border-black font-archivo font-black text-xs uppercase cursor-pointer hover:bg-[#bce002]"
                        >
                          {approvingCode === item.code ? 'Approving...' : 'Approve & Activate Code ✓'}
                        </button>
                        <button
                          onClick={() =>
                            copyText(
                              `Welcome ${item.buyerName}! Your payment (Ref: ${item.orderId}) has been confirmed. Access Code: ${item.code} — Open here: ${magicUrl}`,
                              `pending-wa-${item.code}`
                            )
                          }
                          className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:border-black cursor-pointer"
                        >
                          {copiedId === `pending-wa-${item.code}` ? 'Copied ✓' : 'Copy Unlock Msg'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customer email, order ID, name, or code..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'pending_payment', 'active', 'activated', 'pending', 'revoked'] as StatusFilter[]).map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-[#D2F803] text-black font-bold border border-black'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent'
                  }`}
                >
                  {filter === 'pending_payment'
                    ? `Verify (${stats.pendingPaymentCount})`
                    : filter === 'pending'
                      ? 'Not Activated'
                      : filter}
                </button>
              ))}

              <button
                onClick={() => setShowCreateForm(prev => !prev)}
                className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-archivo font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-stone-800 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D2F803]" />
                Create Access Code
              </button>
            </div>
          </div>

          {/* Inline Create Access Code Drawer */}
          {showCreateForm && (
            <form
              onSubmit={handleCreateCodeSubmit}
              className="bg-white border-2 border-black rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-archivo text-lg font-black uppercase text-stone-900">
                    Issue New Customer Access Code
                  </h3>
                  <p className="text-xs text-stone-500">
                    Saves to Cloud Firestore and triggers your Make.com delivery webhook if configured.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs font-semibold text-stone-500 hover:text-black cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Buyer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBuyerName}
                    onChange={e => setNewBuyerName(e.target.value)}
                    placeholder="e.g. Neema Hassan"
                    className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    value={newBuyerEmail}
                    onChange={e => setNewBuyerEmail(e.target.value)}
                    placeholder="buyer@example.com"
                    className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Order ID / M-Pesa Ref
                  </label>
                  <input
                    type="text"
                    value={newOrderId}
                    onChange={e => setNewOrderId(e.target.value)}
                    placeholder="e.g. SELAR-9482 or QX74K29M"
                    className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={e => setNewPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-black"
                  >
                    <option value="M-Pesa Lipa Namba">M-Pesa Lipa Namba</option>
                    <option value="Tigo Pesa / Airtel Money">Tigo Pesa / Airtel Money</option>
                    <option value="Selar Card Checkout">Selar Card Checkout</option>
                    <option value="WhatsApp Manual Transfer">WhatsApp Manual Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Currency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCurrencyToggle('TZS')}
                      className={`py-2.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        newCurrency === 'TZS'
                          ? 'bg-black text-white border-black'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      TZS (Tanzania)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyToggle('USD')}
                      className={`py-2.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        newCurrency === 'USD'
                          ? 'bg-black text-white border-black'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      USD (Intl Card)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isIssuing}
                  className="px-6 py-3 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-xs uppercase tracking-wider border border-black hover:bg-[#bce002] cursor-pointer disabled:opacity-60"
                >
                  {isIssuing ? 'Saving to Cloud...' : 'Generate & Save Access Code'}
                </button>
              </div>

              {recentlyIssued && (
                <div className="bg-stone-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#D2F803] font-bold uppercase">
                      Access Code Issued for {recentlyIssued.buyerName}
                    </p>
                    <p className="font-mono text-lg font-black tracking-wider mt-1">
                      {recentlyIssued.code}
                    </p>
                    <p className="text-xs text-stone-400 font-mono truncate max-w-md mt-0.5">
                      {appOrigin}/?key={recentlyIssued.code}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `Welcome ${recentlyIssued.buyerName}! Access Code: ${recentlyIssued.code} — Open: ${appOrigin}/?key=${recentlyIssued.code}`,
                          'new-issue-copy'
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-white text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === 'new-issue-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'new-issue-copy' ? 'Copied' : 'Copy Access Message'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Customer & License Table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-archivo font-bold uppercase tracking-wider text-stone-500">
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Order ID &amp; Method</th>
                    <th className="py-3.5 px-4">Access Code</th>
                    <th className="py-3.5 px-4">Activation</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {filteredLicenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center text-stone-500">
                        {licenses.length === 0
                          ? 'No customer access codes issued yet. Paid buyers via checkout or Admin manual issue will appear here in real time.'
                          : 'No customer records match your current search or filter.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLicenses.map(item => {
                      const magicUrl = `${appOrigin}/?key=${item.code}`;
                      return (
                        <tr key={item.code} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4 align-top">
                            <p className="font-bold text-stone-900">{item.buyerName}</p>
                            <p className="text-xs text-stone-500 font-mono">
                              {item.email || 'No email recorded'}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <p className="font-mono text-xs font-bold text-stone-800">
                              {item.orderId || '—'}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5 font-mono tabular-nums">
                              {item.paymentMethod || item.source || 'Order'} ·{' '}
                              {item.currency === 'USD'
                                ? `$${item.amount ?? settings.priceUSD}`
                                : `TSh ${(item.amount ?? settings.priceTZS).toLocaleString()}`}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold bg-stone-100 px-2.5 py-1 rounded border border-stone-200 text-stone-900">
                                {item.code}
                              </span>
                              <button
                                onClick={() => copyText(magicUrl, `link-${item.code}`)}
                                title="Copy direct unlock link"
                                className="text-stone-400 hover:text-black cursor-pointer"
                              >
                                {copiedId === `link-${item.code}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <p className="text-[11px] text-stone-400 font-mono mt-1">
                              Issued {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            {item.activated ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Activated
                                </span>
                                {item.activatedAt && (
                                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                                    {new Date(item.activatedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-amber-700">
                                Not yet activated
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            {item.isActive ? (
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                Paid · Active
                              </span>
                            ) : item.paymentStatus === 'Pending' ? (
                              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                Pending Check
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="inline-flex flex-wrap items-center justify-end gap-2">
                              {!item.isActive && item.paymentStatus === 'Pending' ? (
                                <button
                                  onClick={() => handleApprovePending(item)}
                                  disabled={approvingCode === item.code}
                                  className="px-3 py-1.5 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase cursor-pointer whitespace-nowrap hover:bg-[#bce002]"
                                >
                                  {approvingCode === item.code ? 'Approving...' : 'Approve Paid'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTriggerResendEmail(item)}
                                  disabled={resendingCode === item.code}
                                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:border-black hover:text-black flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  {resendingCode === item.code
                                    ? 'Sending...'
                                    : resentSuccessCode === item.code
                                      ? 'Prepared ✓'
                                      : 'Resend Email'}
                                </button>
                              )}
                              <button
                                onClick={() => onToggleLicenseStatus(item.code, !item.isActive)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap border ${
                                  item.isActive
                                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {item.isActive ? (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    Revoke
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    Restore
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Resend / Preview Modal */}
          {emailPreviewLicense && (
            <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Access Email Ready for {emailPreviewLicense.buyerName}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {draftSettings.makeWebhookUrl
                      ? 'Triggered Make.com resend webhook and updated timestamp in Cloud Firestore.'
                      : 'Recorded resend timestamp in Cloud Firestore. Open your email client below or copy the ready-to-send email.'}
                  </p>
                </div>
                <button
                  onClick={() => setEmailPreviewLicense(null)}
                  className="text-xs font-bold text-stone-500 hover:text-black cursor-pointer"
                >
                  Close
                </button>
              </div>
              <pre className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs text-stone-800 whitespace-pre-wrap font-mono">
                {buildWelcomeEmailText(emailPreviewLicense)}
              </pre>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => copyText(buildWelcomeEmailText(emailPreviewLicense), 'email-body-copy')}
                  className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'email-body-copy' ? <Check className="w-3.5 h-3.5 text-[#D2F803]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'email-body-copy' ? 'Email Copied' : 'Copy Access Email'}
                </button>
                {emailPreviewLicense.email && (
                  <a
                    href={`mailto:${encodeURIComponent(emailPreviewLicense.email)}?subject=${encodeURIComponent(`Your Access Code: ${emailPreviewLicense.code}`)}&body=${encodeURIComponent(buildWelcomeEmailText(emailPreviewLicense))}`}
                    className="px-4 py-2 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send via Email App
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PRICING, WHATSAPP & CHECKOUT LINKS */}
      {subTab === 'pricing' && (
        <form onSubmit={handleSaveSettingsSubmit} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-archivo text-xl font-black uppercase text-stone-900">
              Pricing, WhatsApp &amp; Checkout Links
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Changes sync live across the public sales page, Tanzania Lipa Namba instructions, and International Selar card checkout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                value={draftSettings.guideTitle}
                onChange={e => setDraftSettings(prev => ({ ...prev, guideTitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Seller WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                value={draftSettings.sellerWhatsApp}
                onChange={e => setDraftSettings(prev => ({ ...prev, sellerWhatsApp: e.target.value }))}
                placeholder="+255757895896"
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Tanzania Price (TSh)
              </label>
              <input
                type="number"
                value={draftSettings.priceTZS}
                onChange={e => setDraftSettings(prev => ({ ...prev, priceTZS: Number(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono tabular-nums focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                International Price (USD)
              </label>
              <input
                type="number"
                value={draftSettings.priceUSD}
                onChange={e => setDraftSettings(prev => ({ ...prev, priceUSD: Number(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono tabular-nums focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Tanzania Direct Mobile Money Number (No Till)
              </label>
              <input
                type="text"
                value={draftSettings.lipaNamba}
                onChange={e => setDraftSettings(prev => ({ ...prev, lipaNamba: e.target.value }))}
                placeholder="0757 895 896"
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Registered Mobile Money Name
              </label>
              <input
                type="text"
                value={draftSettings.lipaName}
                onChange={e => setDraftSettings(prev => ({ ...prev, lipaName: e.target.value }))}
                placeholder="SARAH KAPUYA"
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Selar International Card Checkout URL (Connect your live Selar product page)
              </label>
              <input
                type="url"
                value={draftSettings.selarCheckoutUrl}
                onChange={e => setDraftSettings(prev => ({ ...prev, selarCheckoutUrl: e.target.value }))}
                placeholder="https://selar.co/quiet-sales-engine"
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
              />
              <p className="text-xs text-stone-500 mt-1">
                When set, international card buyers on the public sales page pay directly on your Selar checkout page and unlock via Selar → Make.com → Supabase.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Private Seller Admin Key (Change from default BB-ADMIN-2025)
              </label>
              <input
                type="text"
                value={draftSettings.adminPin || ''}
                onChange={e => setDraftSettings(prev => ({ ...prev, adminPin: e.target.value.toUpperCase() }))}
                placeholder="BB-ADMIN-2025"
                className="w-full sm:max-w-xs px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono uppercase focus:outline-none focus:border-black"
              />
              <p className="text-xs text-stone-500 mt-1">
                Used to unlock this Seller Admin Dashboard cleanly via /?admin=1 or Enter Code.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-200">
            <div>
              {settingsSavedBanner && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved to Cloud Firestore &amp; synced live.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-3 rounded-lg bg-[#111111] text-white font-archivo font-black text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer disabled:opacity-60"
            >
              {isSavingSettings ? 'Saving...' : 'Save Storefront Settings'}
            </button>
          </div>

          {/* Live Buyer Wins & Feedback Section Manager */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div>
              <h3 className="font-archivo text-base font-black uppercase text-stone-900">
                Real Buyer Wins &amp; DM Testimonials (Live on Sales Page)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add real customer quotes or M-Pesa sales wins below. They appear immediately below Case Studies on your public sales page.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                value={revName}
                onChange={e => setRevName(e.target.value)}
                placeholder="Buyer Name (e.g. Neema J.)"
                className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={revLocation}
                onChange={e => setRevLocation(e.target.value)}
                placeholder="City (e.g. Dar es Salaam)"
                className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={revNiche}
                onChange={e => setRevNiche(e.target.value)}
                placeholder="Business (e.g. Pastry Chef)"
                className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={revResult}
                onChange={e => setRevResult(e.target.value)}
                placeholder="Win (e.g. TSh 180,000 wk 1)"
                className="px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={revQuote}
                onChange={e => setRevQuote(e.target.value)}
                placeholder="Paste customer DM or WhatsApp quote here..."
                className="flex-1 px-3 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddBuyerReview}
                className="px-4 py-2.5 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase cursor-pointer whitespace-nowrap"
              >
                + Publish Review Live
              </button>
            </div>

            {(draftSettings.buyerReviews || []).length > 0 && (
              <div className="space-y-2 pt-2">
                {(draftSettings.buyerReviews || []).map(rev => (
                  <div
                    key={rev.id}
                    className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex items-start justify-between gap-3"
                  >
                    <div className="text-xs">
                      <p className="font-bold text-stone-900">
                        {rev.name} ({rev.niche} · {rev.location}) —{' '}
                        <span className="text-emerald-700 font-mono">{rev.result}</span>
                      </p>
                      <p className="text-stone-600 italic mt-0.5">&ldquo;{rev.quote}&rdquo;</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBuyerReview(rev.id)}
                      title="Delete review"
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      )}

      {/* SUB-TAB 3: SELAR -> MAKE.COM -> SUPABASE -> EMAIL + CLOUDFLARE DOMAIN */}
      {subTab === 'automation' && (
        <div className="space-y-6">
          {/* Live Pipeline Connection Status Strip */}
          <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-archivo text-lg font-black uppercase text-stone-900">
                  Live Connection Status: Selar → Make.com → Supabase
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Paste your personal Selar URL, Make.com Webhook, and Supabase credentials below to complete the live automated international flow.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
                <p className="font-mono text-[11px] font-bold uppercase text-emerald-800">
                  1. Cloud Firestore
                </p>
                <p className="text-xs font-bold text-stone-900 mt-1">Connected &amp; Live ✓</p>
                <p className="text-[11px] text-stone-600 mt-0.5">Licenses, orders &amp; workspaces sync in real time.</p>
              </div>

              <div className={`border rounded-lg p-3.5 flex flex-col justify-between ${settings.selarCheckoutUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div>
                  <p className={`font-mono text-[11px] font-bold uppercase ${settings.selarCheckoutUrl ? 'text-emerald-800' : 'text-amber-800'}`}>
                    2. Selar Card Link
                  </p>
                  <p className="text-xs font-bold text-stone-900 mt-1">
                    {settings.selarCheckoutUrl ? 'Connected ✓' : 'Paste Selar URL Below'}
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {settings.selarCheckoutUrl ? 'International button routes to Selar.' : 'Sign in to Selar & copy your product link.'}
                  </p>
                </div>
                <a
                  href="https://selar.co/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline"
                >
                  Open Selar Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className={`border rounded-lg p-3.5 flex flex-col justify-between ${settings.makeWebhookUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div>
                  <p className={`font-mono text-[11px] font-bold uppercase ${settings.makeWebhookUrl ? 'text-emerald-800' : 'text-amber-800'}`}>
                    3. Make.com Webhook
                  </p>
                  <p className="text-xs font-bold text-stone-900 mt-1">
                    {settings.makeWebhookUrl ? 'Connected ✓' : 'Paste Make Webhook Below'}
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {settings.makeWebhookUrl ? 'Triggers emails on order & resend.' : 'Create a Webhooks trigger & paste URL.'}
                  </p>
                </div>
                <a
                  href="https://www.make.com/en/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline"
                >
                  Open Make.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className={`border rounded-lg p-3.5 flex flex-col justify-between ${settings.supabaseProjectUrl && settings.supabaseAnonKey ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div>
                  <p className={`font-mono text-[11px] font-bold uppercase ${settings.supabaseProjectUrl && settings.supabaseAnonKey ? 'text-emerald-800' : 'text-amber-800'}`}>
                    4. Supabase Mirror
                  </p>
                  <p className="text-xs font-bold text-stone-900 mt-1">
                    {settings.supabaseProjectUrl && settings.supabaseAnonKey ? 'Connected ✓' : 'Paste Supabase Keys Below'}
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {settings.supabaseProjectUrl && settings.supabaseAnonKey ? 'Verifies codes & emails from Supabase.' : 'Optional mirror (Firestore is already live).'}
                  </p>
                </div>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline"
                >
                  Open Supabase <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Live Selar + Make.com + Supabase Connection Settings */}
          <form onSubmit={handleSaveSettingsSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
            <h3 className="font-archivo text-base font-black uppercase text-stone-900">
              Connect Your Selar, Make.com &amp; Supabase Credentials
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-stone-600">
                    Selar Product Checkout URL (Where international card buyers pay)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyText(`${appOrigin}/?selar=paid`, 'selar-redirect-copy')}
                    className="text-[11px] font-bold text-stone-700 hover:text-black underline cursor-pointer"
                  >
                    {copiedId === 'selar-redirect-copy'
                      ? 'Copied Post-Purchase Redirect URL ✓'
                      : 'Copy Post-Purchase Redirect URL for Selar'}
                  </button>
                </div>
                <input
                  type="url"
                  value={draftSettings.selarCheckoutUrl}
                  onChange={e => setDraftSettings(prev => ({ ...prev, selarCheckoutUrl: e.target.value }))}
                  placeholder="https://selar.co/your-product-slug"
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Make.com Webhook URL (Triggered on new order or Resend Email)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={draftSettings.makeWebhookUrl}
                    onChange={e => setDraftSettings(prev => ({ ...prev, makeWebhookUrl: e.target.value }))}
                    placeholder="https://hook.eu2.make.com/..."
                    className="flex-1 px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleTestMakeWebhook}
                    disabled={isTestingWebhook || !draftSettings.makeWebhookUrl}
                    className="px-4 py-2.5 rounded-lg border border-black text-xs font-archivo font-bold uppercase hover:bg-stone-100 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                  </button>
                </div>
                {webhookTestResult === 'ok' && (
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    Webhook accepted test payload cleanly.
                  </p>
                )}
                {webhookTestResult === 'fail' && (
                  <p className="text-xs text-amber-700 font-semibold mt-1">
                    Make.com webhook did not confirm HTTP 200. Verify your scenario is Active and Listening.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Supabase Project URL (Optional Mirror Verification)
                </label>
                <input
                  type="url"
                  value={draftSettings.supabaseProjectUrl}
                  onChange={e => setDraftSettings(prev => ({ ...prev, supabaseProjectUrl: e.target.value }))}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Supabase Anon Public Key (Read-only Verification)
                </label>
                <input
                  type="text"
                  value={draftSettings.supabaseAnonKey}
                  onChange={e => setDraftSettings(prev => ({ ...prev, supabaseAnonKey: e.target.value }))}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              {settingsSavedBanner ? (
                <p className="text-xs font-bold text-emerald-700">Automation keys saved.</p>
              ) : (
                <p className="text-xs text-stone-500">
                  When configured, any buyer entering a code from Selar/Supabase unlocks the app automatically.
                </p>
              )}
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-lg bg-[#111111] text-white text-xs font-archivo font-black uppercase tracking-wider cursor-pointer"
              >
                {isSavingSettings ? 'Saving...' : 'Save Integration Keys'}
              </button>
            </div>
          </form>

          {/* Copyable SQL & Make Spec */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-archivo text-sm font-black uppercase text-stone-900">
                  1. Supabase Licenses Table SQL
                </h4>
                <button
                  type="button"
                  onClick={() => copyText(supabaseSqlSchema, 'sql-copy')}
                  className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'sql-copy' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'sql-copy' ? 'Copied' : 'Copy SQL'}
                </button>
              </div>
              <pre className="bg-[#111111] text-stone-200 rounded-lg p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
                {supabaseSqlSchema}
              </pre>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-archivo text-sm font-black uppercase text-stone-900">
                  2. Make.com Scenario Mapping Spec
                </h4>
                <button
                  type="button"
                  onClick={() => copyText(makePayloadSpec, 'make-copy')}
                  className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'make-copy' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'make-copy' ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <pre className="bg-[#111111] text-stone-200 rounded-lg p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
                {makePayloadSpec}
              </pre>
            </div>
          </div>

          {/* Cloudflare engine.biasharabase.com Deployment Guide */}
          <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-stone-500">
                  Custom Domain Setup · engine.biasharabase.com
                </p>
                <h3 className="font-archivo text-lg font-black uppercase text-stone-900 mt-0.5">
                  Deploy Directly to Cloudflare Pages in 60 Seconds
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/cloudflare-pages-dist.zip"
                  download="cloudflare-pages-dist.zip"
                  className="px-4 py-2.5 rounded-lg bg-[#D2F803] text-black border border-black text-xs font-archivo font-black uppercase flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Built App ZIP (GitHub &amp; Cloudflare Ready)
                </a>
                <a
                  href="/the-quiet-sales-engine.zip"
                  download="the-quiet-sales-engine.zip"
                  className="px-4 py-2.5 rounded-lg bg-white text-stone-800 border border-stone-300 hover:border-black text-xs font-archivo font-bold uppercase flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Source Code ZIP
                </a>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-950 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                The <strong>Built App ZIP</strong> is already compiled into 14 flat files (including <code>wrangler.jsonc</code> pointing <code>&quot;directory&quot;: &quot;./&quot;</code>) with zero subfolders — upload all 14 files straight to your GitHub repo and deploy on Cloudflare with <code>npx wrangler deploy</code>, or use Direct Upload.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2.5">
                <p className="font-archivo text-sm font-black uppercase text-stone-900">
                  Option A (Zero Build): GitHub or Cloudflare Direct Upload
                </p>
                <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1.5 leading-relaxed">
                  <li>Click <strong>Built App ZIP</strong> above and unzip it (14 flat files, including <code>wrangler.jsonc</code>).</li>
                  <li><strong>Via GitHub:</strong> Upload all 14 files to your repo root → connect to Cloudflare with <strong>Build command: (empty)</strong> and <strong>Deploy command: <code>npx wrangler deploy</code></strong>.</li>
                  <li><strong>Or Direct Upload:</strong> Cloudflare Dashboard → <strong>Workers &amp; Pages → Create → Continue to Pages → Direct Upload</strong>.</li>
                  <li>Open <strong>Custom Domains → Set up a custom domain</strong> and type <code>engine.biasharabase.com</code>.</li>
                </ol>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-archivo text-sm font-black uppercase text-stone-900">
                    Option B: Cloudflare Worker Route Proxy
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(workerProxyCode, 'worker-copy')}
                    className="px-2.5 py-1 rounded bg-white border border-stone-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'worker-copy' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'worker-copy' ? 'Copied' : 'Copy Worker'}
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Attach this Worker to route <code>engine.biasharabase.com/*</code> with an orange-cloud AAAA record pointing to <code>100::</code>:
                </p>
                <pre className="bg-[#111111] text-stone-200 rounded-lg p-3 text-[10px] font-mono overflow-x-auto leading-relaxed">
                  {workerProxyCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
