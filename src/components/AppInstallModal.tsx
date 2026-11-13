import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Share2, 
  Copy, 
  Check, 
  Globe, 
  Download, 
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Server,
  Code,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppInstallModal({ isOpen, onClose }: AppInstallModalProps) {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [workerCopied, setWorkerCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'cloudflare'>('cloudflare');
  const [cloudflareMethod, setCloudflareMethod] = useState<'worker' | 'pages'>('worker');
  const [customDomain, setCustomDomain] = useState('bareglow-salon-book');

  // The canonical public preview URL for the salon
  const currentUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('ais-dev-') 
        ? window.location.origin.replace('ais-dev-', 'ais-pre-') 
        : window.location.origin)
    : 'https://ais-pre-dv5yzjgbysfac5hhj7f75m-975042813454.europe-west2.run.app';

  const originHost = typeof window !== 'undefined'
    ? (window.location.origin.includes('ais-dev-') 
        ? window.location.host.replace('ais-dev-', 'ais-pre-') 
        : window.location.host)
    : 'ais-pre-dv5yzjgbysfac5hhj7f75m-975042813454.europe-west2.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#064e3b', // Emerald 900
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Bareglow Book and Management · Petrocity Nyali\nOpen the Salon Book & Staff Portal here:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const cloudflareWorkerCode = `/**
 * Bareglow Book and Management - Cloudflare Reverse Proxy
 * Maps your custom domain (${customDomain || 'book.bareglow.co.ke'}) directly to your live app
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = '${originHost}';
    
    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // Set official origin host for Cloud Run
    newRequest.headers.set('Host', '${originHost}');
    newRequest.headers.set('X-Forwarded-Host', request.headers.get('Host') || '${customDomain}');
    
    return fetch(newRequest);
  }
};`;

  const handleCopyWorkerCode = () => {
    navigator.clipboard.writeText(cloudflareWorkerCode);
    setWorkerCopied(true);
    setTimeout(() => setWorkerCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-amber-400 p-1 shadow-md flex items-center justify-center shrink-0 border border-amber-300">
              <img 
                src="/blessed_poultry_logo.jpg" 
                alt="Blessed Poultry Logo" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-stone-950 mb-1">
                <Sparkles className="w-3 h-3" />
                iPhone &amp; Computer Ready · Tanzania
              </div>
              <h2 className="text-xl font-serif font-bold text-white leading-tight">
                Blessed Poultry &amp; Bareglow App
              </h2>
              <p className="text-xs text-stone-300">
                Tanzania (Phone: 0757 895 896) · Open on any iPhone, Android, or Computer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-t border-emerald-800/80 pt-3">
            <button
              onClick={() => setActiveTab('cloudflare')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'cloudflare'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Cloudflare (Own Name)
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'install'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Phone App (PWA)
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Scan QR
            </button>
          </div>
        </div>

        {/* Tab 1: Cloudflare Custom Domain Setup */}
        {activeTab === 'cloudflare' && (
          <div className="p-6 space-y-5 text-xs">
            {/* Cloudflare Banner */}
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                CF
              </div>
              <div className="leading-relaxed">
                <span className="font-bold text-sm text-orange-950 block">
                  Yes, You Can Easily Use Your Own Cloudflare Domain!
                </span>
                <span className="text-orange-900 text-xs">
                  You can point your domain (e.g. <strong className="font-mono">book.bareglow.co.ke</strong> or <strong className="font-mono">management.bareglow.com</strong>) directly to this app so staff and clients see your exact salon name.
                </span>
              </div>
            </div>

            {/* Cloudflare Method Selector */}
            <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCloudflareMethod('worker')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  cloudflareMethod === 'worker'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-emerald-800" />
                <span>Option 1: Cloudflare Worker Proxy (2 Mins, Easiest)</span>
              </button>
              <button
                type="button"
                onClick={() => setCloudflareMethod('pages')}
                className={`py-1.5 px-3 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  cloudflareMethod === 'pages'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                <span>Option 2: Cloudflare Pages</span>
              </button>
            </div>

            {/* Method 1: Cloudflare Worker (Instant Reverse Proxy) */}
            {cloudflareMethod === 'worker' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-stone-800">
                    What custom domain do you want to use?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. book.bareglow.co.ke"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-800 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Recommended: Use a clean subdomain like <strong className="text-stone-700">book.yourdomain.com</strong> or <strong className="text-stone-700">app.yourdomain.co.ke</strong>
                  </p>
                </div>

                {/* 3 Step Guide */}
                <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">
                    How to set it up in your Cloudflare Dashboard:
                  </span>
                  <ol className="space-y-2 text-stone-700 list-decimal list-inside pl-0.5 leading-relaxed">
                    <li>
                      Log into <strong>dash.cloudflare.com</strong> and click <strong>Workers & Pages</strong> in the left sidebar.
                    </li>
                    <li>
                      Click <strong>Create application</strong> &gt; <strong>Create Worker</strong> &gt; <strong>Deploy</strong>.
                    </li>
                    <li>
                      Click <strong>Edit code</strong>, replace the default code with the snippet below, and click <strong>Deploy</strong>:
                    </li>
                  </ol>

                  {/* Worker Code Snippet */}
                  <div className="relative mt-2">
                    <pre className="p-3 bg-stone-900 text-amber-200 text-[11px] font-mono rounded-xl overflow-x-auto max-h-36 border border-stone-800">
                      {cloudflareWorkerCode}
                    </pre>
                    <button
                      onClick={handleCopyWorkerCode}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                    >
                      {workerCopied ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                      <span>{workerCopied ? 'Copied Code!' : 'Copy Snippet'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-600 pt-1">
                    4. In your Worker, go to <strong>Settings</strong> &gt; <strong>Domains & Routes</strong> &gt; <strong>Add Custom Domain</strong> &gt; Enter <strong>{customDomain || 'book.bareglow.co.ke'}</strong>. Cloudflare will automatically activate free SSL in ~30 seconds!
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px]">
                    <strong>Advantage:</strong> Every change you make stays live automatically with Cloud Firestore sync. No manual rebuilding needed!
                  </span>
                </div>
              </div>
            )}

            {/* Method 2: Cloudflare Pages Direct Hosting */}
            {cloudflareMethod === 'pages' && (
              <div className="space-y-3">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 leading-relaxed">
                  <span className="font-bold text-stone-900 block text-xs">
                    Deploying directly to Cloudflare Pages (Git or Drag & Drop)
                  </span>
                  <p className="text-stone-600">
                    If you prefer Cloudflare Pages to host the static assets directly:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-700 pl-1">
                    <li><strong>Framework preset:</strong> Vite</li>
                    <li><strong>Build command:</strong> <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">npm run build</code></li>
                    <li><strong>Build output directory:</strong> <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">dist</code></li>
                    <li><strong>Node.js Version:</strong> 20 or higher</li>
                  </ul>
                  
                  <div className="pt-2">
                    <a
                      href="/bareglow-book-and-management.zip"
                      download="bareglow-book-and-management.zip"
                      className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-xs transition"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Download Complete Project Code (.ZIP)</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Download ZIP Bar */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-amber-950 block text-xs">Complete Project ZIP Archive Ready</span>
                <span className="text-[11px] text-amber-900">Download the full repository for offline backup, local development, or Cloudflare upload.</span>
              </div>
              <a
                href="/bareglow-book-and-management.zip"
                download="bareglow-book-and-management.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Download .ZIP</span>
              </a>
            </div>

            {/* Direct Target Link */}
            <div className="pt-2 border-t border-stone-200">
              <label className="block text-[11px] font-bold text-stone-500 mb-1">
                Your Current Live Cloud Target (Origin URL):
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-100 border border-stone-200 font-mono text-[11px] text-stone-700 break-all select-all">
                <span className="flex-1 truncate">{currentUrl}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 transition cursor-pointer shrink-0"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Install as Native App (Hides Browser Address Bar) */}
        {activeTab === 'install' && (
          <div className="p-6 space-y-5">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 leading-relaxed">
                <strong className="block font-bold text-sm text-emerald-900 mb-0.5">
                  Install as a Full-Screen App (Zero-Cost Solution)
                </strong>
                When added to your phone or tablet home screen, the browser address bar disappears completely. It opens directly with the icon and title:
                <span className="block mt-1 font-serif font-bold text-emerald-950 text-sm">
                  "Bareglow Book and Management"
                </span>
              </div>
            </div>

            {isInstalled ? (
              <div className="text-center py-4 px-3 bg-stone-50 rounded-xl border border-stone-200">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-800">
                  App is Installed on this Device!
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  You are running Bareglow Book and Management in standalone mode.
                </p>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                1-Tap Install App on this Device
              </button>
            ) : null}

            {/* Step-by-Step for Phones & Tablets */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                How to add on any Phone or Tablet (Safari / Chrome):
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* iPhone / iPad */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 shadow-xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-black">
                        
                      </span>
                      <span className="font-bold">iPhone / iPad (Safari)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950">
                      Kwa Watumiaji wa iPhone
                    </span>
                  </div>
                  <ol className="space-y-1.5 text-stone-700 list-decimal list-inside pl-0.5 leading-relaxed text-[11px]">
                    <li>Fungua link hii kwenye kivinjari cha <strong>Safari</strong> kwenye iPhone yako.</li>
                    <li>Gusa kitufe cha <strong>Share</strong> (kishale kinachoelekea juu <strong className="font-mono">↑</strong> chini ya screen ya iPhone).</li>
                    <li>Shuka kidogo kisha chagua <strong>Add to Home Screen</strong> (Weka kwenye Skrini ya Mwanzo).</li>
                    <li>Gusa <strong>Add</strong> upande wa juu kulia.</li>
                    <li className="text-emerald-800 font-semibold">Tayari! App ya Blessed Poultry itafunguka kama programu kamili bila browser bar.</li>
                  </ol>
                </div>

                {/* Android / Samsung */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                      A
                    </span>
                    Android / Chrome
                  </div>
                  <ol className="space-y-1.5 text-stone-600 list-decimal list-inside pl-0.5 leading-relaxed">
                    <li>Tap the <strong>three dots (⋮)</strong> menu top-right.</li>
                    <li>Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</li>
                    <li>Tap Install to save the official icon.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Send to Staff WhatsApp
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: QR Code for Reception & Staff */}
        {activeTab === 'qr' && (
          <div className="p-6 text-center space-y-4">
            <p className="text-xs text-stone-600">
              Point any smartphone camera at this QR code to open the salon book immediately:
            </p>

            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-emerald-900/10 shadow-lg mx-auto">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Bareglow Book QR Code" 
                  className="w-56 h-56 mx-auto rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-stone-100 rounded-lg">
                  <span className="text-xs text-stone-400">Generating QR...</span>
                </div>
              )}
              <div className="mt-2 font-serif font-bold text-emerald-950 text-sm">
                Bareglow Book & Management
              </div>
              <div className="text-[11px] text-stone-500">
                Scan to Open on Staff Mobile
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied' : 'Copy Direct URL'}
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                WhatsApp QR Link
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Cloud Sync Active & Cloud Firestore Connected
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
