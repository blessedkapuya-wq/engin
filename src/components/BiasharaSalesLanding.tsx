import { useState } from 'react';
import {
  BIASHARA_META,
  CASE_STUDIES,
  TEMPLATE_VAULT_20
} from '../data/biasharaGuideData';
import {
  validatePasscode,
  createPendingMobileMoneyLicense,
  saveUserLicenseSession,
  isAdminKeyMatch
} from '../utils/security';
import { engineFirestoreService } from '../services/engineFirestoreService';
import {
  EngineAppSettings,
  EngineOrderRecord,
  IssuedPasscode
} from '../types/biashara';
import {
  Check,
  ArrowRight,
  Key,
  ShieldCheck,
  Eye,
  MessageSquare,
  X,
  CreditCard,
  ExternalLink,
  Smartphone,
  AlertCircle
} from 'lucide-react';

interface BiasharaSalesLandingProps {
  onUnlockApp: (licenseKey?: string, buyerName?: string, email?: string) => Promise<void> | void;
  onOrderCompleted: (passcode: IssuedPasscode, order: EngineOrderRecord) => Promise<void>;
  onOpenPreviewChapter: (chapterIndex: number) => void;
  settings: EngineAppSettings;
  cloudLicenses: IssuedPasscode[];
}

export default function BiasharaSalesLanding({
  onUnlockApp,
  onOrderCompleted,
  onOpenPreviewChapter,
  settings,
  cloudLicenses
}: BiasharaSalesLandingProps) {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  // Payment Drawer / Modal state
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [paymentPath, setPaymentPath] = useState<'tanzania' | 'international'>('tanzania');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Tanzania Mobile Money Form State
  const [tzName, setTzName] = useState('');
  const [tzEmail, setTzEmail] = useState('');
  const [tzPhone, setTzPhone] = useState('');
  const [tzNetwork, setTzNetwork] = useState('M-Pesa (Vodacom)');
  const [tzRef, setTzRef] = useState('');
  const [tzError, setTzError] = useState('');

  // Pending Verification Submission Receipt
  const [pendingReceipt, setPendingReceipt] = useState<{
    pendingCode: string;
    buyerName: string;
    email: string;
    phone: string;
    network: string;
    refId: string;
    amountTZS: number;
  } | null>(null);
  const [pendingStatusNote, setPendingStatusNote] = useState<string | null>(null);
  const [isCheckingPending, setIsCheckingPending] = useState(false);

  const cleanWaNumber = settings.sellerWhatsApp.replace(/[^0-9]/g, '');
  const sampleTemplate = TEMPLATE_VAULT_20[0];

  const handleOpenCheckout = (path: 'tanzania' | 'international') => {
    setPaymentPath(path);
    setPendingReceipt(null);
    setPendingStatusNote(null);
    setIsBuyModalOpen(true);
  };

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim().toUpperCase();
    if (!clean) {
      setPasscodeError('Please enter your personal access code.');
      return;
    }
    setIsVerifyingCode(true);
    setPasscodeError(null);

    try {
      if (isAdminKeyMatch(clean, settings.adminPin)) {
        saveUserLicenseSession({
          code: clean,
          buyerName: 'Admin',
          isAdmin: true,
          activatedAt: new Date().toISOString()
        });
        setIsPasscodeModalOpen(false);
        await onUnlockApp(clean, 'Admin');
        return;
      }

      const cloudCheck = await engineFirestoreService.verifyCodeInCloud(
        passcodeInput.trim(),
        settings
      );
      if (cloudCheck.pending) {
        setPasscodeError(
          `Your payment proof is waiting for seller verification on ${settings.lipaNamba} (${settings.lipaName}). Send your M-Pesa/Tigo SMS on WhatsApp for instant approval.`
        );
        return;
      }
      if (cloudCheck.revoked) {
        setPasscodeError('This access code has been revoked by the seller.');
        return;
      }

      const resolvedCode = cloudCheck.license?.code || clean;
      const isLocallyValid = validatePasscode(resolvedCode, cloudLicenses, settings.adminPin);
      if (cloudCheck.valid || (!resolvedCode.includes('@') && isLocallyValid)) {
        const parts = resolvedCode.split('-');
        const buyerName =
          cloudCheck.license?.buyerName || (parts.length >= 2 ? parts[1] : 'Member');
        const email = cloudCheck.license?.email || '';

        saveUserLicenseSession({
          code: resolvedCode,
          buyerName,
          email,
          isAdmin: false,
          activatedAt: new Date().toISOString()
        });
        setIsPasscodeModalOpen(false);
        await onUnlockApp(resolvedCode, buyerName, email);
        return;
      }

      setPasscodeError('Code or email not recognized. Check spelling or tap Buy Now to get access.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleTanzaniaPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTzError('');
    if (!tzName.trim()) {
      setTzError('Please enter your full name.');
      return;
    }
    const cleanRef = tzRef.trim().toUpperCase();
    if (cleanRef.length < 4) {
      setTzError('Enter your valid M-Pesa / Tigo Pesa / Airtel Money transaction code.');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const pendingPasscode = createPendingMobileMoneyLicense(
        tzName,
        `${tzNetwork} (${settings.lipaNamba})`,
        cleanRef,
        tzEmail.trim(),
        tzPhone.trim(),
        settings.priceTZS
      );

      const orderRecord: EngineOrderRecord = {
        id: cleanRef,
        buyerName: pendingPasscode.buyerName,
        email: tzEmail.trim() || tzPhone.trim(),
        amount: settings.priceTZS,
        currency: 'TZS',
        paymentMethod: tzNetwork,
        referenceId: cleanRef,
        licenseCode: pendingPasscode.code,
        timestamp: pendingPasscode.createdAt,
        status: 'Pending',
        source: 'Mobile Money (Pending)'
      };

      await onOrderCompleted(pendingPasscode, orderRecord);

      setPendingReceipt({
        pendingCode: pendingPasscode.code,
        buyerName: pendingPasscode.buyerName,
        email: tzEmail.trim(),
        phone: tzPhone.trim(),
        network: tzNetwork,
        refId: cleanRef,
        amountTZS: settings.priceTZS
      });
      setPendingStatusNote(null);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCheckPendingApproval = async () => {
    if (!pendingReceipt) return;
    setIsCheckingPending(true);
    setPendingStatusNote(null);
    try {
      const check = await engineFirestoreService.verifyCodeInCloud(
        pendingReceipt.pendingCode,
        settings
      );
      if (check.valid && check.license) {
        saveUserLicenseSession({
          code: check.license.code,
          buyerName: check.license.buyerName,
          email: check.license.email || '',
          isAdmin: false,
          activatedAt: new Date().toISOString()
        });
        setIsBuyModalOpen(false);
        await onUnlockApp(
          check.license.code,
          check.license.buyerName,
          check.license.email || ''
        );
      } else {
        setPendingStatusNote(
          `Not approved yet — tap "Send Proof on WhatsApp" below so ${settings.lipaName} confirms ref ${pendingReceipt.refId} right away.`
        );
      }
    } finally {
      setIsCheckingPending(false);
    }
  };

  return (
    <div className="bg-[#F5F5F3] text-stone-900">
      {/* SECTION 1: CLEAR PROPOSITION & SINGLE PRIMARY CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-14">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-wider uppercase text-stone-500">
                {BIASHARA_META.brand} · {settings.guideTitle}
              </p>

              <h1 className="font-archivo text-4xl sm:text-5xl font-black tracking-tight text-stone-950 leading-[1.05] text-balance">
                Sell What You Know{' '}
                <span className="bg-[#D2F803] px-2 py-0.5 inline-block text-black">
                  Without Filming Reels
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl">
                A simple step-by-step toolkit with fill-in-the-blank text posts and DM scripts to turn social media conversations into paid orders—without showing your face on video or buying ads.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={() => handleOpenCheckout('tanzania')}
                  className="px-6 py-4 rounded-xl bg-[#111111] text-white font-archivo font-bold text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    Get Instant Access — TSh {settings.priceTZS.toLocaleString()} / ${settings.priceUSD}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#D2F803]" />
                </button>

                <button
                  onClick={() => onOpenPreviewChapter(0)}
                  className="px-5 py-4 rounded-xl bg-white border border-stone-300 text-stone-900 font-archivo font-bold text-sm hover:border-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Read Chapter 1 Free</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                <button
                  onClick={() => setIsPasscodeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-stone-900 font-semibold underline underline-offset-4 hover:text-black cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  Already bought it? Enter your access code
                </button>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span>One-time payment · Instant web + PDF access</span>
              </div>
            </div>
          </div>

          {/* Right Summary Card: Plain-language breakdown of what you get */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                What&apos;s Included Inside
              </p>

              <ul className="space-y-3.5 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-950">Offer Builder:</strong> Fill in your niche and price once—every script updates to match your business automatically.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-950">20 Text Templates &amp; 45-Day Plan:</strong> Never guess what to post on Threads, LinkedIn, Instagram, or WhatsApp Status.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-950">Copy-Paste DM Scripts:</strong> Word-for-word replies for pricing questions, follow-ups, and closing sales politely.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-950">8-Chapter Offline PDF:</strong> Read the complete playbook in 25 minutes from any phone or computer.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Pay via M-Pesa, Tigo Pesa, or Card</span>
              <span className="font-mono font-bold text-stone-900 tabular-nums">
                TSh {settings.priceTZS.toLocaleString()} / ${settings.priceUSD}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS IN 3 SIMPLE STEPS + 1 REAL SAMPLE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-stone-200 space-y-10">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            How It Works
          </p>
          <h2 className="font-archivo text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
            Three quiet steps from blank screen to paid customer
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-2.5">
            <p className="font-mono text-xs font-bold text-stone-400">01. Setup</p>
            <h3 className="font-archivo text-lg font-bold text-stone-950">
              Enter your offer once
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Type who you help, what you sell, and your price. The app instantly tailors your bio hook, posts, and DM replies for your business.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-2.5">
            <p className="font-mono text-xs font-bold text-stone-400">02. Publish</p>
            <h3 className="font-archivo text-lg font-bold text-stone-950">
              Post plain text in 15 mins
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Copy a daily prompt from the 20-Template Vault or 7-Day Launch Plan. Spend 15 minutes leaving helpful comments so buyers tap your profile.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-2.5">
            <p className="font-mono text-xs font-bold text-stone-400">03. Close</p>
            <h3 className="font-archivo text-lg font-bold text-stone-950">
              Convert replies in your DMs
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Use the DM Script Library to answer &ldquo;How much?&rdquo;, handle doubts politely, and send your mobile money or card checkout link.
            </p>
          </div>
        </div>

        {/* Single Clear Sample Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Sample Template Inside
            </p>
            <h3 className="font-archivo text-xl font-bold text-stone-950">
              {sampleTemplate.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every template includes a fill-in-the-blank structure plus a real written example ready to post on {sampleTemplate.bestFor}.
            </p>
          </div>
          <div className="md:col-span-7 bg-stone-50 border border-stone-200 rounded-xl p-5">
            <p className="text-sm text-stone-800 leading-relaxed">
              &ldquo;{sampleTemplate.tanzanianExample}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHO THIS IS FOR & REAL RESULTS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-stone-200 space-y-8">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Who It&apos;s Built For
            </p>
            <h2 className="font-archivo text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Made for people who prefer writing over filming
            </h2>
            <ul className="space-y-2.5 text-sm text-stone-700 pt-1">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                <span>Freelancers &amp; consultants tired of getting ghosted in DMs</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                <span>Creators selling PDF guides, templates, or spreadsheets</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                <span>Small businesses taking pre-orders via WhatsApp &amp; social DMs</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-stone-950 shrink-0 mt-0.5" />
                <span>Busy founders with under 1,000 followers and 20 mins a day</span>
              </li>
            </ul>
          </div>

          {/* Proof Cards: Live Buyer Reviews (if any) or Concise Case Outcomes */}
          <div className="md:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Real Customer Outcomes
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(settings.buyerReviews && settings.buyerReviews.length > 0
                ? settings.buyerReviews.slice(0, 2).map(rev => ({
                    id: rev.id,
                    title: rev.name,
                    meta: `${rev.niche} · ${rev.location}`,
                    summary: rev.quote,
                    result: rev.result
                  }))
                : CASE_STUDIES.slice(0, 2).map(cs => ({
                    id: cs.id,
                    title: cs.name,
                    meta: `${cs.archetype} · ${cs.location}`,
                    summary: cs.changeMade,
                    result: cs.outcomeMetric
                  }))
              ).map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-stone-500">{item.meta}</p>
                    <p className="font-archivo text-sm font-bold text-stone-950">{item.title}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">&ldquo;{item.summary}&rdquo;</p>
                  </div>
                  <p className="font-mono text-xs font-bold text-stone-950 pt-2 border-t border-stone-100">
                    {item.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SIMPLE PRICING & CHECKOUT */}
      <section id="pricing-checkout" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-stone-200">
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#D2F803]">
                One-Time Purchase · Lifetime Access
              </p>
              <h2 className="font-archivo text-3xl sm:text-4xl font-black tracking-tight">
                Start today for{' '}
                <span className="font-mono tabular-nums text-[#D2F803]">
                  TSh {settings.priceTZS.toLocaleString()}
                </span>{' '}
                <span className="text-stone-400 text-2xl font-mono tabular-nums">
                  (${settings.priceUSD} USD)
                </span>
              </h2>
              <p className="text-sm text-stone-300 max-w-xl">
                One single sale of your own product or service pays back 100% of this toolkit. Includes all 9 workspace tabs, DM scripts, and the 8-chapter offline PDF.
              </p>
            </div>
          </div>

          {/* 2 Clear Checkout Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleOpenCheckout('tanzania')}
              className="w-full py-4 px-5 rounded-xl bg-[#D2F803] text-black font-archivo font-black text-sm hover:bg-[#bce002] transition-colors flex items-center justify-between gap-3 cursor-pointer text-left"
            >
              <div>
                <span className="block text-xs font-semibold opacity-80">Inside Tanzania</span>
                <span>Pay with M-Pesa / Tigo Pesa (TSh {settings.priceTZS.toLocaleString()})</span>
              </div>
              <Smartphone className="w-5 h-5 shrink-0" />
            </button>

            {settings.selarCheckoutUrl ? (
              <a
                href={settings.selarCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-5 rounded-xl bg-white text-black font-archivo font-black text-sm hover:bg-stone-100 transition-colors flex items-center justify-between gap-3 text-left"
              >
                <div>
                  <span className="block text-xs font-semibold text-stone-500">
                    International &amp; Diaspora
                  </span>
                  <span>Pay by Card / Apple Pay (${settings.priceUSD} USD)</span>
                </div>
                <ExternalLink className="w-5 h-5 shrink-0" />
              </a>
            ) : (
              <button
                onClick={() => handleOpenCheckout('international')}
                className="w-full py-4 px-5 rounded-xl bg-white text-black font-archivo font-black text-sm hover:bg-stone-100 transition-colors flex items-center justify-between gap-3 cursor-pointer text-left"
              >
                <div>
                  <span className="block text-xs font-semibold text-stone-500">
                    International &amp; Diaspora
                  </span>
                  <span>Pay by Card / Selar (${settings.priceUSD} USD)</span>
                </div>
                <CreditCard className="w-5 h-5 shrink-0" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-800 text-xs text-stone-400">
            <button
              onClick={() => setIsPasscodeModalOpen(true)}
              className="text-white underline underline-offset-4 hover:text-[#D2F803] cursor-pointer"
            >
              Already paid? Enter your Access Code or Email
            </button>
            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                `Hello ${settings.lipaName}! I have a quick question about ${settings.guideTitle}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D2F803]" />
              <span>Questions? Chat on WhatsApp ({settings.sellerWhatsApp})</span>
            </a>
          </div>
        </div>
      </section>

      {/* MODAL 1: ENTER PERSONAL ACCESS CODE */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 relative">
            <button
              onClick={() => {
                setIsPasscodeModalOpen(false);
                setPasscodeError(null);
              }}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <p className="font-mono text-xs font-bold uppercase text-stone-500">
                Member Verification
              </p>
              <h3 className="font-archivo text-xl font-black uppercase text-stone-900">
                Enter Access Code or Email
              </h3>
              <p className="text-sm text-stone-600">
                Paste the code sent to you (e.g. <span className="font-mono">BB-NAME-4821-K4</span>) or enter the email used on Selar.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={passcodeInput}
                  onChange={e => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError(null);
                  }}
                  placeholder="BB-XXXX-0000-X0 or you@email.com"
                  className="w-full px-4 py-3.5 border-2 border-stone-300 rounded-xl font-mono text-base font-bold tracking-wider focus:outline-none focus:border-black"
                />
                {passcodeError && (
                  <p className="text-xs font-semibold text-red-600 mt-2 flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passcodeError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifyingCode}
                className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-archivo font-black text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer disabled:opacity-60"
              >
                {isVerifyingCode ? 'Verifying...' : 'Open My Workspace'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CLEAN DUAL-PATH CHECKOUT */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 relative my-8">
            <button
              onClick={() => setIsBuyModalOpen(false)}
              aria-label="Close checkout"
              className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {pendingReceipt ? (
              <div className="space-y-5">
                <div className="bg-[#111111] text-white rounded-xl p-5 space-y-2">
                  <p className="font-mono text-xs font-bold uppercase text-[#D2F803]">
                    Step 2 of 2 · Payment Proof Submitted
                  </p>
                  <h3 className="font-archivo text-2xl font-black uppercase">
                    Awaiting Verification
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Reference <strong className="text-white font-mono">{pendingReceipt.refId}</strong> is queued for {settings.lipaName} ({settings.lipaNamba}). Send the WhatsApp confirmation below for approval in 1–3 minutes.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase font-mono">Buyer</span>
                    <span className="font-bold text-stone-900">{pendingReceipt.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase font-mono">Transaction Ref</span>
                    <span className="font-mono font-black text-stone-900">{pendingReceipt.refId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase font-mono">Reserved Code</span>
                    <span className="font-mono font-bold text-stone-700">{pendingReceipt.pendingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 uppercase font-mono">Status</span>
                    <span className="font-bold text-amber-700">Pending Confirmation</span>
                  </div>
                </div>

                {pendingStatusNote && (
                  <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    {pendingStatusNote}
                  </p>
                )}

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                      `Hello ${settings.lipaName}! I have paid for ${settings.guideTitle} (TSh ${pendingReceipt.amountTZS.toLocaleString()}) to ${settings.lipaNamba}.\n\nName: ${pendingReceipt.buyerName}\nNetwork: ${pendingReceipt.network}\nTransaction Ref: ${pendingReceipt.refId}\nEmail: ${pendingReceipt.email || '-'}\nReserved Code: ${pendingReceipt.pendingCode}\n\nPlease verify and confirm my access code.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-[#D2F803] text-black border-2 border-black font-archivo font-black text-xs uppercase tracking-wider hover:bg-[#bce002] flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Proof on WhatsApp ({settings.lipaNamba})</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCheckPendingApproval}
                    disabled={isCheckingPending}
                    className="w-full py-3 rounded-xl bg-[#111111] text-white font-archivo font-bold text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer disabled:opacity-60"
                  >
                    {isCheckingPending ? 'Checking Approval...' : 'I Was Approved — Unlock Now'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-stone-500">
                    Select Payment Method
                  </p>
                  <h3 className="font-archivo text-xl font-black uppercase text-stone-900 mt-0.5">
                    Get {settings.guideTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentPath('tanzania')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer ${
                      paymentPath === 'tanzania'
                        ? 'bg-white text-black shadow-xs border border-stone-300'
                        : 'text-stone-600'
                    }`}
                  >
                    Tanzania (TSh {settings.priceTZS.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentPath('international')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-archivo font-bold uppercase cursor-pointer ${
                      paymentPath === 'international'
                        ? 'bg-white text-black shadow-xs border border-stone-300'
                        : 'text-stone-600'
                    }`}
                  >
                    International (${settings.priceUSD} Card)
                  </button>
                </div>

                {paymentPath === 'tanzania' ? (
                  <form onSubmit={handleTanzaniaPaymentSubmit} className="space-y-4">
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-1">
                      <p className="font-bold text-stone-900">
                        Step 1: Send TSh {settings.priceTZS.toLocaleString()} to {settings.lipaNamba} ({settings.lipaName})
                      </p>
                      <p>Supports M-Pesa, Tigo Pesa (Mixx by Yas), Airtel Money, and HaloPesa.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={tzName}
                          onChange={e => setTzName(e.target.value)}
                          placeholder="e.g. Amina Hassan"
                          className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Email (optional)</label>
                        <input
                          type="email"
                          value={tzEmail}
                          onChange={e => setTzEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Network</label>
                        <select
                          value={tzNetwork}
                          onChange={e => setTzNetwork(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-black"
                        >
                          <option value="M-Pesa (Vodacom)">M-Pesa (Vodacom)</option>
                          <option value="Mixx by Yas (Tigo Pesa)">Mixx by Yas (Tigo Pesa)</option>
                          <option value="Airtel Money">Airtel Money</option>
                          <option value="HaloPesa">HaloPesa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Transaction Ref *</label>
                        <input
                          type="text"
                          required
                          value={tzRef}
                          onChange={e => setTzRef(e.target.value)}
                          placeholder="e.g. QX74K29M"
                          className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg font-mono uppercase focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Phone (optional)</label>
                      <input
                        type="tel"
                        value={tzPhone}
                        onChange={e => setTzPhone(e.target.value)}
                        placeholder="+255 7XX XXX XXX"
                        className="w-full px-3 py-2.5 text-sm border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-black"
                      />
                    </div>

                    {tzError && <p className="text-xs font-semibold text-red-600">{tzError}</p>}

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-archivo font-black text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessingPayment ? 'Submitting...' : 'Submit Payment Proof'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#111111] text-white rounded-xl p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold uppercase text-[#D2F803]">
                          Secure Card Checkout · ${settings.priceUSD} USD
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#D2F803]" />
                      </div>
                      <h4 className="font-archivo text-lg font-black uppercase">
                        Pay Safely on Selar
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Pay securely with Visa, Mastercard, or Apple Pay on Selar. Right after payment, your personal access code arrives by email and unlocks this app automatically.
                      </p>
                    </div>

                    {settings.selarCheckoutUrl ? (
                      <a
                        href={settings.selarCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-[#D2F803] text-black border-2 border-black font-archivo font-black text-xs uppercase tracking-wider hover:bg-[#bce002] flex items-center justify-center gap-2"
                      >
                        <span>Continue to Selar (${settings.priceUSD} USD)</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                          `Hello ${settings.lipaName}! I am outside Tanzania and would like the international card payment link for ${settings.guideTitle} ($${settings.priceUSD} USD).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-[#D2F803] text-black border-2 border-black font-archivo font-black text-xs uppercase tracking-wider hover:bg-[#bce002] flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Request Card Payment Link (${settings.priceUSD} USD)</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsBuyModalOpen(false);
                        setIsPasscodeModalOpen(true);
                      }}
                      className="w-full py-2 text-xs font-bold text-stone-600 hover:text-black underline cursor-pointer"
                    >
                      Already paid on Selar? Enter Code or Email
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
