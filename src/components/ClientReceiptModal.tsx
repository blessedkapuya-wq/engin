import React from 'react';
import {
  Printer,
  Share2,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { DailySaleEntry } from '../types/salon';
import { SALON_INFO } from '../data/bareglowCatalog';

interface ClientReceiptModalProps {
  sale: DailySaleEntry | null;
  onClose: () => void;
}

export default function ClientReceiptModal({ sale, onClose }: ClientReceiptModalProps) {
  if (!sale) return null;

  // Format clean receipt number
  const receiptNumber = `BG-${sale.date.replace(/-/g, '')}-${sale.id.replace('sal-', '').slice(-4).toUpperCase()}`;

  // Clean phone number for WhatsApp URL (e.g., +254 7XX... -> 2547XXXXXXXX)
  const getCleanPhone = (phone?: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      return '254' + digits.slice(1);
    }
    if (digits.startsWith('254')) {
      return digits;
    }
    return digits;
  };

  const clientPhoneClean = getCleanPhone(sale.clientPhone);

  // Generate friendly WhatsApp message text
  const generateWhatsAppMessage = () => {
    const text = `✨ *BAREGLOW SALON & SPA RECEIPT* ✨
━━━━━━━━━━━━━━━━━━━━
📍 *Location:* Nyali Petrocity / Nairobi, Kenya
📞 *Phone / WhatsApp:* +254 796 134 777
🏪 *M-Pesa Buy Goods Till:* 9597237

🧾 *Receipt No:* ${receiptNumber}
📅 *Date & Time:* ${sale.date} at ${sale.time}
👤 *Client Name:* ${sale.clientName}
💇 *Attending Stylist:* ${sale.staffName}
✨ *Treatment / Item:* ${sale.itemName} (${sale.type})
💳 *Payment Mode:* ${sale.paymentMethod} (Till 9597237)
💰 *Total Paid:* KSh ${sale.amountKSh.toLocaleString()}
${sale.notes ? `📝 *Notes:* ${sale.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
_Thank you for glowing with Bareglow!_
_Book your next touch-up or styling with us anytime._ ✨💇‍♀️`;

    return encodeURIComponent(text);
  };

  const handleShareWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = clientPhoneClean
      ? `https://wa.me/${clientPhoneClean}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
              Official Client E-Receipt
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Paper Container */}
        <div className="p-6 bg-stone-50/70 border-b border-stone-200">
          <div className="bg-white rounded-xl p-5 shadow-xs border border-stone-200 space-y-4 font-sans text-stone-800">
            {/* Salon Header */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300 space-y-1">
              <div className="flex justify-center mb-1">
                <img
                  src="/bareglow_logo_trimmed.png"
                  alt="Bareglow Logo"
                  className="h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-stone-900">
                {SALON_INFO.name}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                Hair Care · Aesthetic Facials · Spa Wellness
              </p>
              <p className="text-[10px] text-stone-500">
                Nyali Petrocity · Nairobi, Kenya
              </p>
              <div className="pt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-bold font-mono">
                <span>M-Pesa Buy Goods Till:</span>
                <strong className="text-emerald-950">9597237</strong>
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-dashed border-stone-200 text-stone-600">
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-semibold">Receipt Number</span>
                <span className="font-mono font-bold text-stone-900">{receiptNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-stone-400 block font-semibold">Date &amp; Time</span>
                <span className="font-mono font-medium text-stone-900">{sale.date} · {sale.time}</span>
              </div>
            </div>

            {/* Client & Specialist Details */}
            <div className="bg-stone-50 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-800" />
                  Client:
                </span>
                <span className="font-bold text-stone-900">{sale.clientName}</span>
              </div>
              {sale.clientPhone && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-medium">Phone:</span>
                  <span className="font-mono text-stone-700">{sale.clientPhone}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-emerald-800" />
                  Specialist Attended:
                </span>
                <span className="font-semibold text-emerald-950">{sale.staffName}</span>
              </div>
            </div>

            {/* Treatment / Item Line */}
            <div className="space-y-1 pt-1">
              <div className="flex items-start justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">{sale.itemName}</div>
                  <span className="inline-block text-[10px] text-stone-500 uppercase font-semibold">
                    Category: {sale.type}
                  </span>
                </div>
                <div className="font-mono font-bold text-stone-900 tabular-nums">
                  KSh {sale.amountKSh.toLocaleString()}
                </div>
              </div>

              {sale.notes && (
                <div className="text-[11px] text-stone-600 bg-amber-50/70 p-2 rounded border border-amber-200/60 mt-1">
                  <strong className="text-amber-950 font-semibold">Treatment Note:</strong> {sale.notes}
                </div>
              )}
            </div>

            {/* Total Block */}
            <div className="pt-3 border-t-2 border-dashed border-stone-300">
              <div className="flex items-center justify-between text-sm py-1">
                <span className="font-bold text-stone-700">TOTAL PAID</span>
                <span className="font-mono font-extrabold text-lg text-emerald-950 tabular-nums">
                  KSh {sale.amountKSh.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-emerald-800" />
                  Payment Method
                </span>
                <span className="font-semibold text-emerald-900 font-mono">
                  {sale.paymentMethod} {sale.paymentMethod === 'M-Pesa' ? '(Till 9597237)' : 'Cash Drawer'}
                </span>
              </div>
            </div>

            {/* Footer Blessing */}
            <div className="text-center pt-3 border-t border-dashed border-stone-200 text-stone-500 text-[10px] space-y-0.5">
              <p className="font-semibold text-stone-700">Thank you for choosing Bareglow Salon &amp; Spa!</p>
              <p>For bookings &amp; consultations: +254 796 134 777</p>
              <p className="text-[9px] text-stone-400 font-mono">Director: Tinez Kapuya</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (User Friendly & Staff Friendly) */}
        <div className="p-4 bg-white space-y-2">
          {/* WhatsApp Direct Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Send Receipt to Client on WhatsApp</span>
            {sale.clientPhone && (
              <span className="text-[10px] font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-200">
                {sale.clientPhone}
              </span>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

          <p className="text-[10px] text-center text-stone-400">
            Tap &quot;Send Receipt on WhatsApp&quot; to automatically format and open WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
