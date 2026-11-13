import { useState } from 'react';
import {
  DollarSign,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  History,
  TrendingUp,
  AlertCircle,
  Plus,
  CheckCircle2,
  Lock,
  Printer,
  Sparkles,
  AlertTriangle,
  Info,
  Sliders,
  Sprout,
  PiggyBank
} from 'lucide-react';
import { OwnerVaultState, OwnerWithdrawal } from '../types/salon';
import { SALON_INFO } from '../data/bareglowCatalog';

interface OwnerVaultManagerProps {
  vaultState: OwnerVaultState;
  onUpdateVault: (updated: OwnerVaultState) => void;
}

export default function OwnerVaultManager({ vaultState, onUpdateVault }: OwnerVaultManagerProps) {
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [withdrawType, setWithdrawType] = useState<OwnerWithdrawal['withdrawalType']>('Owner Monthly Salary');
  const [withdrawMethod, setWithdrawMethod] = useState<'M-Pesa' | 'Bank Transfer (Equity/KCB)' | 'Cash'>('M-Pesa');
  const [destinationAccount, setDestinationAccount] = useState('+254 796 134 777 (Owner Tinez Kapuya)');
  const [withdrawNotes, setWithdrawNotes] = useState('Disciplined monthly owner personal salary draw');
  const [successToast, setSuccessToast] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showOverdrawWarning, setShowOverdrawWarning] = useState(false);

  // Settings state
  const [salaryTarget, setSalaryTarget] = useState(vaultState.monthlyOwnerSalaryTargetKSh || 75000);
  const [reinvestmentPct, setReinvestmentPct] = useState(Math.round((vaultState.reinvestmentRate || 0.45) * 100));
  const [reserveTarget, setReserveTarget] = useState(vaultState.salonEmergencyReserveKSh || 80000);

  // Calculations
  const totalNetOperatingProfit = Math.max(
    0,
    vaultState.totalGrossRevenueKSh -
      vaultState.totalPayrollExpensesKSh -
      vaultState.totalTaxLiabilityKSh -
      vaultState.operatingExpensesKSh
  );

  // Growth fund retained (e.g. 45% of net profit)
  const calculatedGrowthFund = Math.round(totalNetOperatingProfit * (reinvestmentPct / 100));

  // Max safe owner personal salary cap for this month
  const monthlySalaryCap = salaryTarget;
  const alreadyDrawnThisMonth = vaultState.totalOwnerDrawnThisMonthKSh || 0;
  const remainingSafeToWithdrawForPersonalUse = Math.max(0, monthlySalaryCap - alreadyDrawnThisMonth);

  // Financial Health Status
  const drawingRatio = monthlySalaryCap > 0 ? (alreadyDrawnThisMonth / monthlySalaryCap) * 100 : 0;
  let healthStatus: 'healthy' | 'caution' | 'danger' = 'healthy';
  if (drawingRatio >= 100) healthStatus = 'danger';
  else if (drawingRatio >= 75) healthStatus = 'caution';

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return;

    // Check if drawing for personal use exceeds remaining safe salary
    if (withdrawType !== 'Business Reinvestment' && amount > remainingSafeToWithdrawForPersonalUse && !showOverdrawWarning) {
      setShowOverdrawWarning(true);
      return;
    }

    const newWithdrawal: OwnerWithdrawal = {
      id: 'wdr-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      amountKSh: amount,
      withdrawalType: withdrawType,
      method: withdrawMethod,
      destinationAccount,
      notes: withdrawNotes,
      status: 'Completed'
    };

    const updatedWithdrawals = [newWithdrawal, ...vaultState.withdrawals];
    const newAlreadyDrawn = withdrawType === 'Owner Monthly Salary' || withdrawType === 'Personal Drawing'
      ? alreadyDrawnThisMonth + amount
      : alreadyDrawnThisMonth;

    const newWithdrawable = Math.max(0, vaultState.withdrawableProfitKSh - amount);

    onUpdateVault({
      ...vaultState,
      totalOwnerDrawnThisMonthKSh: newAlreadyDrawn,
      withdrawableProfitKSh: newWithdrawable,
      withdrawals: updatedWithdrawals
    });

    setWithdrawAmount('');
    setShowWithdrawModal(false);
    setShowOverdrawWarning(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  const handleSaveSettings = () => {
    onUpdateVault({
      ...vaultState,
      monthlyOwnerSalaryTargetKSh: salaryTarget,
      reinvestmentRate: reinvestmentPct / 100,
      salonEmergencyReserveKSh: reserveTarget,
      businessGrowthFundKSh: calculatedGrowthFund
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Personal Salary Disbursal Recorded!</strong> Funds transferred to {destinationAccount}. Salon business growth reserves preserved.
            </span>
          </div>
          <button
            onClick={() => window.print()}
            className="underline font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
          >
            Print Voucher
          </button>
        </div>
      )}

      {/* CORE BUSINESS PRINCIPLE BANNER: AVOID BUSINESS DOWNFALL */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Owner Financial Discipline & Growth Guardrail
              </span>
              <h2 className="text-base font-bold tracking-tight">
                Tinez Kapuya · Safe Personal Salary vs. Business Growth Retention
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              healthStatus === 'healthy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : healthStatus === 'caution'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                healthStatus === 'healthy' ? 'bg-emerald-400 animate-pulse' : healthStatus === 'caution' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              {healthStatus === 'healthy'
                ? '🟢 Disciplined: Growth Capital Safe'
                : healthStatus === 'caution'
                ? '🟡 Approaching Monthly Salary Cap'
                : '🔴 Overdrawing Risk: Do Not Take All Funds'}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
          <strong className="text-white">Why this rule protects Bareglow:</strong> A salon owner can inadvertently cause the downfall of her own business by taking all the money for personal use. To ensure Bareglow continuously expands, profits are split between a <strong>disciplined owner personal salary</strong> and a <strong>reinvested growth fund</strong> (for restocking 80 products, salon equipment, and rent).
        </p>
      </div>

      {/* 3-POT FINANCIAL ALLOCATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* POT 1: OWNER SAFE SALARY FOR PERSONAL USE */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                Pot 1: Owner Safe Salary to Take
              </span>
              <span className="p-1.5 bg-emerald-800/80 rounded-lg text-amber-200">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>

            <div className="text-3xl font-bold font-mono tabular-nums text-amber-100">
              KSh {remainingSafeToWithdrawForPersonalUse.toLocaleString()}
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Safe personal living allowance remaining for this month out of your <strong>KSh {monthlySalaryCap.toLocaleString()}</strong> monthly personal salary target.
            </p>

            <div className="pt-2 text-[11px] text-stone-300 space-y-1">
              <div className="flex justify-between">
                <span>Monthly Salary Cap:</span>
                <span className="font-mono text-white">KSh {monthlySalaryCap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Already Taken This Month:</span>
                <span className="font-mono text-amber-300">KSh {alreadyDrawnThisMonth.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setWithdrawType('Owner Monthly Salary');
                setShowWithdrawModal(true);
              }}
              disabled={remainingSafeToWithdrawForPersonalUse <= 0}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowDownRight className="w-4 h-4" />
              Withdraw Personal Salary
            </button>
          </div>
        </div>

        {/* POT 2: PROTECTED BUSINESS GROWTH & RESTOCK FUND */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Pot 2: Protected Growth Fund
              </span>
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Sprout className="w-4 h-4" />
              </span>
            </div>

            <div className="text-3xl font-bold font-mono text-emerald-950 tabular-nums">
              KSh {calculatedGrowthFund.toLocaleString()}
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Retained for Salon Expansion ({reinvestmentPct}% of net profit):</strong> Strictly locked for buying bulk batches of 80 products (including Oshaprapra scrub), modern styling chairs, and marketing.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-900">
              🔒 <strong>Do not withdraw for personal use.</strong> This ensures your salon never runs out of stock or capital.
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-stone-400 block text-center">
              Reinvestment Rate: <strong className="text-stone-800">{reinvestmentPct}%</strong> of Monthly Profit
            </span>
          </div>
        </div>

        {/* POT 3: SALON OPERATING & EMERGENCY BUFFER */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Pot 3: Rent & Operating Buffer
              </span>
              <span className="p-1.5 bg-stone-100 rounded-lg text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
              </span>
            </div>

            <div className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
              KSh {reserveTarget.toLocaleString()}
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Fixed Safety Buffer:</strong> Covers upcoming rent on Links Road Nyali Petrocity, KPLC power tokens, emergency plumbing, and KRA taxes.
            </p>

            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600">
              Guarantees Bareglow survives unexpected low-season weeks without defaulting on bills.
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-stone-400 block text-center">
              Target Operating Reserve: <strong className="text-stone-800">KSh {reserveTarget.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* DISCIPLINARY SLIDER CONTROLS (TINEZ KAPUYA CAN ADJUST TARGETS) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900">
              Configure Your Salon Financial Discipline Policy
            </h3>
          </div>
          <button
            onClick={handleSaveSettings}
            className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-950 transition-colors cursor-pointer"
          >
            Save Financial Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Slider 1: Monthly Owner Salary Target */}
          <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">Monthly Owner Personal Salary Cap:</span>
              <span className="font-mono font-bold text-emerald-900 text-sm">
                KSh {salaryTarget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={30000}
              max={150000}
              step={5000}
              value={salaryTarget}
              onChange={(e) => setSalaryTarget(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <p className="text-[11px] text-stone-500">
              Setting a predictable monthly salary prevents the owner from taking unpredictable amounts that disrupt salon cashflow.
            </p>
          </div>

          {/* Slider 2: Business Growth Reinvestment Percentage */}
          <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">Profit Reinvestment into Salon Growth:</span>
              <span className="font-mono font-bold text-emerald-900 text-sm">
                {reinvestmentPct}% Retained
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={70}
              step={5}
              value={reinvestmentPct}
              onChange={(e) => setReinvestmentPct(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <p className="text-[11px] text-stone-500">
              Recommended: 40% - 50%. The higher this percentage, the faster Bareglow can expand product stock and open additional branches.
            </p>
          </div>
        </div>
      </div>

      {/* WITHDRAWAL AUDIT LEDGER */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900">
              Owner Personal Salary & Drawing Ledger
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {vaultState.withdrawals.length} Disbursals Recorded
          </span>
        </div>

        <div className="border border-stone-200 rounded-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Disbursal Method</th>
                <th className="p-3">Destination / Beneficiary</th>
                <th className="p-3 text-right">Amount (KSh)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {vaultState.withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-stone-700">{w.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {w.withdrawalType || 'Owner Monthly Salary'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-700">{w.method}</td>
                  <td className="p-3 text-stone-900 font-medium">{w.destinationAccount}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-950">
                    KSh {w.amountKSh.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> {w.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => window.print()}
                      className="text-stone-600 hover:text-stone-900 underline text-[11px] cursor-pointer"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Owner Personal Salary / Drawing Disbursal
                </h3>
                <p className="text-xs text-stone-500">
                  Beneficiary: <strong>Tinez Kapuya (Owner)</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setShowOverdrawWarning(false);
                }}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* OVERDRAW WARNING IF EXCEEDING PERSONAL SALARY */}
            {showOverdrawWarning && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-xl space-y-2 text-xs text-red-900">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>Financial Guardrail Alert: Exceeding Monthly Salary Cap!</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  You entered <strong>KSh {Number(withdrawAmount).toLocaleString()}</strong>, but your remaining safe personal salary for this month is <strong>KSh {remainingSafeToWithdrawForPersonalUse.toLocaleString()}</strong>.
                </p>
                <p className="leading-relaxed text-[11px] font-semibold">
                  Withdrawing more will dip directly into the <strong>Salon Growth & Restocking Fund</strong>, meaning less money to purchase products and expand the business.
                </p>
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawAmount(remainingSafeToWithdrawForPersonalUse);
                      setShowOverdrawWarning(false);
                    }}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 rounded font-bold text-xs"
                  >
                    Adjust to Safe Cap (KSh {remainingSafeToWithdrawForPersonalUse.toLocaleString()})
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Withdrawal Purpose / Type *</label>
                <select
                  value={withdrawType}
                  onChange={(e) => setWithdrawType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900"
                >
                  <option value="Owner Monthly Salary">Owner Monthly Personal Salary (Recommended)</option>
                  <option value="Personal Drawing">Personal Drawing / Living Expense</option>
                  <option value="Emergency Personal Advance">Emergency Personal Advance</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Amount to Disburse (KSh) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-400">KSh</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value ? Number(e.target.value) : '');
                      setShowOverdrawWarning(false);
                    }}
                    placeholder={`Max safe: ${remainingSafeToWithdrawForPersonalUse}`}
                    className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded-xl font-mono text-base font-bold text-stone-900"
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500 mt-1">
                  <span>Safe Personal Remaining: <strong className="text-emerald-800 font-mono">KSh {remainingSafeToWithdrawForPersonalUse.toLocaleString()}</strong></span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(remainingSafeToWithdrawForPersonalUse)}
                    className="text-emerald-800 hover:underline font-semibold"
                  >
                    Use Full Safe Limit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Disbursal Method *</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => {
                    const method = e.target.value as any;
                    setWithdrawMethod(method);
                    if (method === 'M-Pesa') setDestinationAccount('+254 796 134 777 (Owner Tinez Kapuya)');
                    else if (method === 'Bank Transfer (Equity/KCB)') setDestinationAccount('Equity Bank - 012029384719 (Bareglow Director)');
                    else setDestinationAccount('Cash Drawer Disbursal');
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900 bg-white"
                >
                  <option value="M-Pesa">M-Pesa Direct (Till to Phone)</option>
                  <option value="Bank Transfer (Equity/KCB)">Bank Transfer (Equity / KCB)</option>
                  <option value="Cash">Cash Drawer</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Destination Account / Phone *</label>
                <input
                  type="text"
                  required
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirm Disbursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
