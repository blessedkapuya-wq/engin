import { Lock, QrCode, Bird, Scissors, Phone, Download, BookMarked } from 'lucide-react';

interface HeaderProps {
  currentView: 'shopbook' | 'inventory' | 'salon' | 'form' | 'preview' | 'owner' | 'poultry' | 'biashara';
  onNavigate: (view: 'shopbook' | 'inventory' | 'salon' | 'form' | 'preview' | 'owner' | 'poultry' | 'biashara') => void;
  activeBusiness: 'poultry' | 'salon' | 'biashara';
  onSwitchBusiness: (biz: 'poultry' | 'salon' | 'biashara') => void;
  lowStockCount?: number;
  onOpenInstallModal?: () => void;
}

export default function Header({ 
  currentView, 
  onNavigate, 
  activeBusiness, 
  onSwitchBusiness, 
  lowStockCount = 0, 
  onOpenInstallModal 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 min-h-18 sm:min-h-20 py-2">
        {/* Zone 1: Dynamic Brand Wordmark & Enriched Logo */}
        {activeBusiness === 'poultry' ? (
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0 group text-left">
            {/* Enlarged Logo as requested */}
            <div className="relative shrink-0">
              <img
                src="/blessed_poultry_logo.jpg"
                alt="Blessed Poultry Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-amber-300/50 transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full px-1 shadow-xs border border-amber-300" title="Tanzania">
                🇹🇿
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 block leading-tight">
                  Blessed Poultry
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Tanzania
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] sm:text-xs text-stone-500 font-mono tracking-wider uppercase block">
                  Chicken &amp; Livestock Farm
                </span>
                <a
                  href="tel:0757895896"
                  className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100 transition"
                  title="Piga Simu / Call Blessed Poultry"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>0757 895 896</span>
                </a>
              </div>
            </div>
          </div>
        ) : activeBusiness === 'biashara' ? (
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left">
            <div className="w-10 h-10 rounded-xl bg-black text-[#D2F803] font-archivo font-black text-lg flex items-center justify-center shadow-md border-2 border-black">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-archivo text-base sm:text-lg font-black tracking-tight text-stone-950 block leading-tight uppercase">
                  biashara base
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#D2F803] text-black border border-black">
                  biasharabase.com
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-600 font-archivo font-bold uppercase tracking-wider block">
                The No-Reels Social Selling Guide
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('shopbook')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left cursor-pointer"
          >
            <img
              src="/bareglow_logo_trimmed.png"
              alt="Bareglow Logo"
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-emerald-950 block leading-tight">
                Bareglow Book and Management
              </span>
              <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase block">
                Petrocity Nyali · Shop Book &amp; Operations
              </span>
            </div>
          </button>
        )}

        {/* Zone 2: Navigation Links or Business Context */}
        {activeBusiness === 'poultry' ? (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              Farm Hub:
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-stone-800 border border-amber-200">
              Entry Date · TZS Pricing · Vaccines · Pumba &amp; Feeds · Medecine · Sales · P&amp;L
            </span>
          </div>
        ) : activeBusiness === 'biashara' ? (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              Digital Product:
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-archivo font-bold bg-[#D2F803]/30 text-stone-900 border border-black">
              8 Chapters Itinerary · 30-Day Plan · Prompt Bank · 4-Number Tracker
            </span>
          </div>
        ) : (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-600">
            <button
              onClick={() => onNavigate('shopbook')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'shopbook'
                  ? 'text-emerald-900 border-b-2 border-emerald-900'
                  : 'hover:text-stone-900'
              }`}
            >
              Daily Shop Book (Sales &amp; Expenses)
            </button>

            <button
              onClick={() => onNavigate('inventory')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'inventory'
                  ? 'text-emerald-900 border-b-2 border-emerald-900'
                  : 'hover:text-stone-900'
              }`}
            >
              <span>Stock Alerts (&lt; 3)</span>
              {lowStockCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('form')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                currentView === 'form' || currentView === 'preview'
                  ? 'text-emerald-900 border-b-2 border-emerald-900'
                  : 'hover:text-stone-900'
              }`}
            >
              Staff Report Book
            </button>

            <button
              onClick={() => onNavigate('salon')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentView === 'salon'
                  ? 'text-emerald-900 border-b-2 border-emerald-900'
                  : 'hover:text-stone-900'
              }`}
            >
              Salon Services &amp; Boutique
            </button>
          </nav>
        )}

        {/* Zone 3: Actions + Business Switcher (Mobile & Computer accessible) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick 3-Way Switcher: Blessed Poultry, Bareglow Salon & BiasharaBase Guide */}
          <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-stone-100 border border-stone-200">
            <button
              onClick={() => onSwitchBusiness('poultry')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeBusiness === 'poultry'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Blessed Poultry"
            >
              <Bird className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Blessed Poultry</span>
            </button>
            <button
              onClick={() => onSwitchBusiness('salon')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeBusiness === 'salon'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to Bareglow Salon"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Salon Book</span>
            </button>
            <button
              onClick={() => onSwitchBusiness('biashara')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-archivo font-bold rounded-lg transition cursor-pointer ${
                activeBusiness === 'biashara'
                  ? 'bg-[#D2F803] text-black shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to BiasharaBase Digital Product Guide"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Biashara Guide</span>
            </button>
          </div>

          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 transition cursor-pointer shadow-2xs"
              title="Open QR Code, Phone Install & Share Link"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-800" />
              <span className="hidden md:inline">Phone &amp; QR</span>
            </button>
          )}

          <a
            href="/bareglow-book-and-management.zip"
            download="bareglow-book-and-management.zip"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 transition cursor-pointer shadow-xs border border-amber-500/30"
            title="Pakua Faili Kamili la ZIP (Download Complete Project ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-stone-950" />
            <span className="hidden sm:inline">ZIP File</span>
          </a>

          {activeBusiness === 'salon' && (
            <button
              onClick={() => onNavigate('owner')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                currentView === 'owner'
                  ? 'bg-emerald-950 text-amber-200 ring-2 ring-emerald-800'
                  : 'bg-emerald-900 hover:bg-emerald-950 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Owner</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
