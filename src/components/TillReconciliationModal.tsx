import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Calendar,
  Clock,
  User,
  History,
  FileCheck,
  ShieldCheck,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DailySaleEntry, SalonExpense, StaffMember, DailyTillHandover } from '../types/salon';
import { SALON_INFO } from '../data/bareglowCatalog';

interface TillReconciliationModalProps {
  sales: DailySaleEntry[];
  expenses: SalonExpense[];
  staffList: StaffMember[];
  handovers: DailyTillHandover[];
  onSaveHandover: (handover: DailyTillHandover) => void;
  onClose: () => void;
}

export default function TillReconciliationModal({
  sales,
  expenses,
  staffList,
  handovers,
  onSaveHandover,
  onClose
}: TillReconciliationModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeSubTab, setActiveSubTab] = useState<'cashup' | 'history'>('cashup');

  // Filter sales and expenses for the chosen date
  const daySales = useMemo(() => sales.filter((s) => s.date === selectedDate), [sales, selectedDate]);
  const dayExpenses = useMemo(() => expenses.filter((e) => e.date === selectedDate), [expenses, selectedDate]);

  // Expected totals
  const totalSalesCount = daySales.length;
  const grossSalesKSh = daySales.reduce((acc, s) => acc + s.amountKSh, 0);

  const cashSalesKSh = daySales
    .filter((s) => s.paymentMethod === 'Cash')
    .reduce((acc, s) => acc + s.amountKSh, 0);

  const mpesaSalesKSh = daySales
    .filter((s) => s.paymentMethod === 'M-Pesa')
    .reduce((acc, s) => acc + s.amountKSh, 0);

  // Cash paid expenses (e.g., petty cash paid from drawer for milk/tea/power)
  const cashExpensesPaidKSh = dayExpenses
    .filter((e) => e.paymentMethod === 'Cash')
    .reduce((acc, e) => acc + e.amountKSh, 0);

  const totalDayExpensesKSh = dayExpenses.reduce((acc, e) => acc + e.amountKSh, 0);

  // The actual cash that MUST be physically in drawer at end of day
  const expectedCashInDrawerKSh = Math.max(0, cashSalesKSh - cashExpensesPaidKSh);
  const expectedMpesaTotalKSh = mpesaSalesKSh;

  // Staff Input State (pre-filled with expected for convenience, staff adjusts if variance)
  const [cashierName, setCashierName] = useState(
    staffList.find((s) => s.status === 'active')?.name || 'Faith Mwangi'
  );
  const [actualCashInput, setActualCashInput] = useState<string>(String(expectedCashInDrawerKSh));
  const [actualMpesaInput, setActualMpesaInput] = useState<string>(String(expectedMpesaTotalKSh));
  const [handoverNotes, setHandoverNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Numerical actuals
  const actualCash = actualCashInput === '' ? 0 : Number(actualCashInput);
  const actualMpesa = actualMpesaInput === '' ? 0 : Number(actualMpesaInput);

  // Variances
  const cashVariance = actualCash - expectedCashInDrawerKSh;
  const mpesaVariance = actualMpesa - expectedMpesaTotalKSh;

  // Status calculation
  const overallStatus: 'Balanced' | 'Shortfall' | 'Surplus' =
    cashVariance === 0 && mpesaVariance === 0
      ? 'Balanced'
      : cashVariance < 0 || mpesaVariance < 0
      ? 'Shortfall'
      : 'Surplus';

  // Format WhatsApp Message for Salon Owner Tinez Kapuya
  const generateWhatsAppHandover = () => {
    const text = `🌙 *BAREGLOW SALON - DAILY TILL HANDOVER & CASH-UP* 🌙
━━━━━━━━━━━━━━━━━━━━━
📍 Nyali Petrocity / Nairobi
📅 Date: ${selectedDate}
⏰ Time: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
👤 Front Desk / Cashier: ${cashierName}
🏪 M-Pesa Buy Goods Till: 9597237

📊 *DAY TURNOVER SUMMARY*
• Total Clients Served: ${totalSalesCount}
• Total Gross Sales: KSh ${grossSalesKSh.toLocaleString()}
• Cash Sales: KSh ${cashSalesKSh.toLocaleString()}
• M-Pesa Sales: KSh ${mpesaSalesKSh.toLocaleString()}
• Cash Expenses Paid Out of Till: -KSh ${cashExpensesPaidKSh.toLocaleString()}

💵 *PHYSICAL CASH IN DRAWER*
• Expected Cash: KSh ${expectedCashInDrawerKSh.toLocaleString()}
• Actual Cash Counted: KSh ${actualCash.toLocaleString()}
• Variance: ${
      cashVariance === 0
        ? '✅ EXACT MATCH (KSh 0)'
        : cashVariance < 0
        ? `🚨 SHORT BY -KSh ${Math.abs(cashVariance).toLocaleString()}`
        : `⚠️ SURPLUS +KSh ${cashVariance.toLocaleString()}`
    }

📱 *M-PESA TILL 9597237 RECONCILIATION*
• Expected M-Pesa: KSh ${expectedMpesaTotalKSh.toLocaleString()}
• Actual M-Pesa Total: KSh ${actualMpesa.toLocaleString()}
• Variance: ${
      mpesaVariance === 0
        ? '✅ EXACT MATCH (KSh 0)'
        : mpesaVariance < 0
        ? `🚨 SHORT BY -KSh ${Math.abs(mpesaVariance).toLocaleString()}`
        : `⚠️ SURPLUS +KSh ${mpesaVariance.toLocaleString()}`
    }

🎯 *OVERALL TILL STATUS:* ${
      overallStatus === 'Balanced'
        ? '✅ 100% BALANCED & VERIFIED'
        : overallStatus === 'Shortfall'
        ? '🚨 SHORTFALL DETECTED'
        : '⚠️ SURPLUS IN TILL'
    }
${handoverNotes ? `📝 Notes: ${handoverNotes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━
_Logged from Bareglow Salon Shop Book System._`;

    return encodeURIComponent(text);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppHandover();
    // Pre-addressed to Salon Owner Tinez Kapuya (+254 796 134 777)
    const url = `https://wa.me/254796134777?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();

    const newHandover: DailyTillHandover = {
      id: `th-${selectedDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      date: selectedDate,
      closingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cashierName,
      totalSalesCount,
      grossSalesKSh,
      expectedCashKSh: expectedCashInDrawerKSh,
      actualCashKSh: actualCash,
      cashVarianceKSh: cashVariance,
      expectedMpesaKSh: expectedMpesaTotalKSh,
      actualMpesaKSh: actualMpesa,
      mpesaVarianceKSh: mpesaVariance,
      cashExpensesPaidKSh,
      totalExpensesKSh: totalDayExpensesKSh,
      status: overallStatus,
      notes: handoverNotes,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      verifiedByOwner: false
    };

    onSaveHandover(newHandover);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveSubTab('history');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Daily Evening Till Reconciliation &amp; Cash-Up</h2>
              <p className="text-[11px] text-stone-400">
                Staff friendly end-of-day cash drawer &amp; M-Pesa balance check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex bg-stone-100 border-b border-stone-200 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('cashup')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'cashup'
                ? 'border-emerald-800 text-emerald-950 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Today&apos;s Cash-Up Form</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'border-emerald-800 text-emerald-950 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Audits &amp; Handovers ({handovers.length})</span>
          </button>
        </div>

        {activeSubTab === 'cashup' && (
          <form onSubmit={handleSubmitHandover} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {/* Friendly Instructions Banner for Staff */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-emerald-950">
                  Easy 3-Step Evening Closing Guide (No accounting skills needed):
                </strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  1. Count physical cash in drawer · 2. Verify Safaricom M-Pesa statement total on Till 9597237 · 3. Check if green &quot;BALANCED&quot; appears, then tap WhatsApp to send report to Director Tinez Kapuya.
                </p>
              </div>
            </div>

            {/* Date and Cashier Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <label className="block text-stone-700 font-bold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                  Cash-Up Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-800" />
                  Cashier / Staff Closing Today *
                </label>
                <select
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs font-semibold text-stone-900"
                >
                  {staffList
                    .filter((s) => s.status === 'active')
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.position})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Step 1: System Calculations for Selected Date */}
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Step 1: Expected Salon Totals (Calculated Automatically)</span>
                <span className="font-mono text-emerald-900 font-semibold">{totalSalesCount} Clients Recorded</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Expected Cash */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Expected Cash In Drawer</span>
                  <div className="text-lg font-mono font-extrabold text-stone-900 mt-0.5">
                    KSh {expectedCashInDrawerKSh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    Cash Sales ({cashSalesKSh.toLocaleString()}) - Cash Expenses ({cashExpensesPaidKSh.toLocaleString()})
                  </div>
                </div>

                {/* Expected M-Pesa */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Expected M-Pesa (Till 9597237)</span>
                  <div className="text-lg font-mono font-extrabold text-emerald-900 mt-0.5">
                    KSh {expectedMpesaTotalKSh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    Direct Safaricom Buy Goods turnover
                  </div>
                </div>

                {/* Total Gross Daily Sales */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Total Day Turnover</span>
                  <div className="text-lg font-mono font-extrabold text-emerald-950 mt-0.5">
                    KSh {grossSalesKSh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    All Cash + M-Pesa treatments
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Actual Physical Count Input */}
            <div className="border-t border-stone-200 pt-3">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                Step 2: Enter What You Physically Have Right Now
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Physical Cash Input */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1.5">
                  <label className="block text-stone-800 font-bold">
                    💵 Actual Cash Counted in Drawer (KSh) *
                  </label>
                  <p className="text-[10px] text-stone-500">
                    Count notes &amp; coins in the front desk register.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400 font-bold">KSh</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={actualCashInput}
                      onChange={(e) => setActualCashInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-white border border-stone-300 rounded-lg font-mono font-bold text-sm text-stone-900 focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  {/* Cash Variance Indicator */}
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Cash Difference:</span>
                    <span
                      className={`font-mono font-bold ${
                        cashVariance === 0
                          ? 'text-emerald-700'
                          : cashVariance < 0
                          ? 'text-red-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {cashVariance === 0
                        ? 'Balanced (KSh 0) ✅'
                        : cashVariance < 0
                        ? `Short -KSh ${Math.abs(cashVariance).toLocaleString()} 🚨`
                        : `Extra +KSh ${cashVariance.toLocaleString()} ⚠️`}
                    </span>
                  </div>
                </div>

                {/* Actual M-Pesa Input */}
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
                  <label className="block text-stone-800 font-bold">
                    📱 Actual M-Pesa Till Statement (KSh) *
                  </label>
                  <p className="text-[10px] text-stone-500">
                    From Safaricom M-Pesa Business app or SMS total.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400 font-bold">KSh</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={actualMpesaInput}
                      onChange={(e) => setActualMpesaInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-white border border-stone-300 rounded-lg font-mono font-bold text-sm text-stone-900 focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  {/* M-Pesa Variance Indicator */}
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">M-Pesa Difference:</span>
                    <span
                      className={`font-mono font-bold ${
                        mpesaVariance === 0
                          ? 'text-emerald-700'
                          : mpesaVariance < 0
                          ? 'text-red-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {mpesaVariance === 0
                        ? 'Balanced (KSh 0) ✅'
                        : mpesaVariance < 0
                        ? `Short -KSh ${Math.abs(mpesaVariance).toLocaleString()} 🚨`
                        : `Extra +KSh ${mpesaVariance.toLocaleString()} ⚠️`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Reconciliation Status Badge */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                overallStatus === 'Balanced'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                  : overallStatus === 'Shortfall'
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2">
                {overallStatus === 'Balanced' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide">
                    {overallStatus === 'Balanced'
                      ? 'Till Reconciliation: 100% BALANCED'
                      : overallStatus === 'Shortfall'
                      ? 'Till Reconciliation: SHORTFALL DETECTED'
                      : 'Till Reconciliation: SURPLUS DETECTED'}
                  </span>
                  <p className="text-[11px] opacity-80">
                    {overallStatus === 'Balanced'
                      ? 'All cash and M-Pesa collections match client sales entries exactly.'
                      : 'Please write a brief explanation below for the discrepancy.'}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-extrabold px-2 py-1 rounded bg-white/80 shadow-2xs">
                {overallStatus}
              </span>
            </div>

            {/* Notes / Reason for Discrepancy */}
            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Closing Notes / Explanation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 50 bob discount approved by owner, or coins rounded down"
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 bg-white"
              />
            </div>

            {isSaved && (
              <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center">
                ✅ Till Handover Saved! Opening historical audit records...
              </div>
            )}

            {/* Actions for Staff */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>Send Handover to Tinez on WhatsApp</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Save &amp; Finalize Handover</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Historical Till Handovers & Audits */}
        {activeSubTab === 'history' && (
          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Past Till Reconciliation Handovers</h3>
                <p className="text-stone-500 text-[11px]">
                  Daily audit records submitted by front desk cashiers for Owner review.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('cashup')}
                className="py-1.5 px-3 bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-emerald-700"
              >
                + New Cash-Up
              </button>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
              {handovers.length === 0 ? (
                <div className="p-6 text-center text-stone-400">
                  No till handovers recorded yet. Submit your first cash-up above.
                </div>
              ) : (
                handovers.map((h) => (
                  <div key={h.id} className="p-4 bg-white hover:bg-stone-50 transition-colors space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">{h.date}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600 font-medium">{h.closingTime}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-700 font-semibold">{h.cashierName}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          h.status === 'Balanced'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : h.status === 'Shortfall'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {h.status === 'Balanced' ? 'Balanced ✅' : h.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                      <div className="p-2 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[10px] text-stone-400 block font-sans">Turnover</span>
                        <strong className="text-stone-900">KSh {h.grossSalesKSh.toLocaleString()}</strong>
                      </div>
                      <div className="p-2 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[10px] text-stone-400 block font-sans">Cash Drawer</span>
                        <strong className="text-stone-900">KSh {h.actualCashKSh.toLocaleString()}</strong>
                        {h.cashVarianceKSh !== 0 && (
                          <span className="text-[10px] text-red-600 block">
                            (Var: {h.cashVarianceKSh})
                          </span>
                        )}
                      </div>
                      <div className="p-2 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[10px] text-stone-400 block font-sans">M-Pesa Till</span>
                        <strong className="text-emerald-900">KSh {h.actualMpesaKSh.toLocaleString()}</strong>
                      </div>
                      <div className="p-2 bg-stone-50 rounded border border-stone-200">
                        <span className="text-[10px] text-stone-400 block font-sans">Clients</span>
                        <strong className="text-stone-900">{h.totalSalesCount} served</strong>
                      </div>
                    </div>

                    {h.notes && (
                      <div className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded">
                        <strong className="text-stone-800">Notes:</strong> {h.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
