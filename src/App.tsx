/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BiasharaBase.com - Dedicated Digital Product Web Application
 * "THE QUIET SALES ENGINE - Digital Product & Social Selling Guide"
 * The No-Reels Text & DM System for Selling Digital Products, Templates & Freelance Services
 */

import BiasharaBaseApp from './components/BiasharaBaseApp';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-stone-900 flex flex-col font-sans selection:bg-[#D2F803] selection:text-black">
      {/* Standalone BiasharaBase Digital Product Guide Application */}
      <BiasharaBaseApp />

      {/* Official Standalone BiasharaBase Footer */}
      <footer className="bg-[#111111] text-stone-400 text-xs py-8 px-4 sm:px-6 border-t-2 border-black no-print">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D2F803] text-black font-archivo font-black text-sm flex items-center justify-center">
              Q
            </div>
            <div>
              <p className="font-archivo font-black text-white uppercase tracking-wider text-sm">
                the quiet sales engine · biasharabase.com
              </p>
              <p className="text-[11px] text-stone-400">
                8 Chapters Itinerary · 30/45-Day Action Plan · Interactive Toolkits · Payment-Secured License Protection
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-archivo font-bold">
            <a
              href="/The-Quiet-Sales-Engine-8-Chapters.pdf"
              download="The-Quiet-Sales-Engine-8-Chapters.pdf"
              className="text-[#D2F803] hover:underline cursor-pointer flex items-center gap-1"
            >
              📥 Download 8-Page PDF
            </a>
            <button
              onClick={() => window.print()}
              className="text-stone-300 hover:text-white hover:underline cursor-pointer"
            >
              🖨️ Browser Print
            </button>
            <a
              href="/quiet-sales-engine-built.zip"
              download="quiet-sales-engine-built.zip"
              className="text-stone-300 hover:text-white hover:underline cursor-pointer"
            >
              📦 Built App (.zip)
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event('biashara-open-admin'))}
              className="text-stone-500 hover:text-stone-300 hover:underline cursor-pointer"
            >
              Seller Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
