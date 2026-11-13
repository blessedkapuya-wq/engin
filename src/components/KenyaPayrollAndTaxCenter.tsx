import { useState, useMemo } from 'react';
import {
  DollarSign,
  Users,
  FileText,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Printer,
  CreditCard,
  Building2,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { StaffMember, StaffReport, DailySaleEntry, SalonExpense } from '../types/salon';
import { computeKenyanPayroll, computeMonthlySalonTaxSummary, calculateKenyaTurnoverTax } from '../utils/kenyaTaxCalculator';
import { SALON_INFO } from '../data/bareglowCatalog';

interface KenyaPayrollAndTaxCenterProps {
  staffList: StaffMember[];
  reports: StaffReport[];
  sales: DailySaleEntry[];
  expenses: SalonExpense[];
}

export default function KenyaPayrollAndTaxCenter({
  staffList,
  reports,
  sales,
  expenses
}: KenyaPayrollAndTaxCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<'monthlyTax' | 'payroll' | 'kraTax'>('monthlyTax');
  const [selectedStaffForPayslip, setSelectedStaffForPayslip] = useState<any | null>(null);
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});

  // Get list of distinct months from sales & expenses
  const availableMonths = useMemo(() => {
    const dates = [
      ...sales.map((s) => s.date.slice(0, 7)),
      ...expenses.map((e) => e.date.slice(0, 7)),
      new Date().toISOString().slice(0, 7)
    ];
    return Array.from(new Set(dates)).sort().reverse();
  }, [sales, expenses]);

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || new Date().toISOString().slice(0, 7));

  // Compute payroll for active staff based on reports and sales
  const computedPayroll = useMemo(() => {
    return staffList
      .filter((s) => s.status !== 'inactive' && s.status !== 'replaced')
      .map((staff) => {
        const staffReport = reports.find((r) => r.staffName.toLowerCase().includes(staff.name.toLowerCase()));
        const serviceSales = staffReport ? staffReport.serviceSalesTotal : (staff.id === 'st-2' ? 68000 : staff.id === 'st-4' ? 42000 : 0);
        const productSales = staffReport ? staffReport.productSalesTotal : (staff.id === 'st-2' ? 14000 : staff.id === 'st-4' ? 8000 : 0);

        const calc = computeKenyanPayroll(
          staff.payType,
          staff.baseSalaryKSh,
          serviceSales,
          productSales,
          staff.commissionRateServices,
          staff.commissionRateProducts
        );

        const commissionEarned = staff.payType === 'salary'
          ? 0
          : Math.round((serviceSales * staff.commissionRateServices) + (productSales * staff.commissionRateProducts));

        return {
          staff,
          serviceSales,
          productSales,
          commissionEarned,
          ...calc
        };
      });
  }, [staffList, reports]);

  // Compute dynamic monthly tax summary from actual sales & expenses
  const monthlyTaxSummary = useMemo(() => {
    return computeMonthlySalonTaxSummary(sales, expenses, computedPayroll, selectedMonth);
  }, [sales, expenses, computedPayroll, selectedMonth]);

  const handleMarkPaid = (staffId: string) => {
    setPaidStatus((prev) => ({ ...prev, [staffId]: true }));
  };

  // Month label formatter (e.g. 2026-11 -> November 2026)
  const formatMonthLabel = (m: string) => {
    if (m === 'all') return 'All Recorded Months';
    const [year, month] = m.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
              <Building2 className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-stone-900">
              Kenya Payroll & Tax Compliance Center (KRA)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Automated tax calculation directly from monthly sales and expense entries · KRA PAYE, SHIF (2.75%), AHL (1.5%), NSSF & Turnover Tax (3%).
          </p>
        </div>

        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('monthlyTax')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'monthlyTax' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            Monthly Tax from Entries
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'payroll' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            Staff Payroll & Payslips
          </button>
          <button
            onClick={() => setActiveSubTab('kraTax')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'kraTax' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            KRA Remittance & PRN
          </button>
        </div>
      </div>

      {/* POLICY BADGE: STRICT NO CREDIT & NO LOANS */}
      <div className="bg-emerald-900 text-emerald-100 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
          <span>
            <strong className="text-white">Strict Cash & M-Pesa Accounting Policy:</strong> Bareglow does not extend credit to clients and maintains zero loans/debt. 100% of reported revenue is realized cash in hand.
          </span>
        </div>
        <span className="text-[11px] bg-emerald-800/90 text-amber-200 px-2.5 py-1 rounded-md font-mono font-semibold">
          Till: 9597237 · Zero Debt Service
        </span>
      </div>

      {/* SUB-TAB 1: AUTOMATED MONTHLY TAX FROM SALES & EXPENSES */}
      {activeSubTab === 'monthlyTax' && (
        <div className="space-y-6">
          {/* Month Selector Strip */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <label htmlFor="tax-month-select" className="text-xs font-bold text-stone-900">
                Calculate Taxes for Period:
              </label>
              <select
                id="tax-month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-emerald-800"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}
                  </option>
                ))}
                <option value="all">All Recorded Months Combined</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span>
                Sales Entries: <strong className="font-mono text-stone-900">{sales.length}</strong>
              </span>
              <span>·</span>
              <span>
                Expense Entries: <strong className="font-mono text-stone-900">{expenses.length}</strong>
              </span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Tax Summary
              </button>
            </div>
          </div>

          {/* Core Monthly Tax Result Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/40 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                  Automated KRA Tax Calculation Engine
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Tax Obligation for {formatMonthLabel(selectedMonth)}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-300 block">Total Tax & Statutory Due to KRA</span>
                <span className="text-3xl font-bold font-mono text-amber-300 tracking-tight tabular-nums">
                  KSh {monthlyTaxSummary.totalKRAPayableKSh.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Live 3-Column Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <span className="text-xs text-emerald-200 block font-medium">1. Gross Sales Entries</span>
                <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                  KSh {monthlyTaxSummary.totalSalesKSh.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-300 mt-1">
                  M-Pesa: KSh {monthlyTaxSummary.mpesaSalesKSh.toLocaleString()} · Cash: KSh {monthlyTaxSummary.cashSalesKSh.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <span className="text-xs text-red-200 block font-medium">2. Allowable Expenses Entries</span>
                <div className="text-2xl font-bold font-mono text-red-300 mt-1 tabular-nums">
                  KSh {monthlyTaxSummary.totalExpensesKSh.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-300 mt-1">
                  Rent, power tokens, salon supplies, repairs
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <span className="text-xs text-amber-200 block font-medium">3. Net Salon Operating Profit</span>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
                  KSh {monthlyTaxSummary.netOperatingProfitKSh.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-300 mt-1">
                  Zero credit/debt deductions (100% liquid)
                </div>
              </div>
            </div>

            {/* Tax Breakdown Table */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/10 text-xs space-y-3">
              <span className="text-stone-300 font-bold block uppercase tracking-wider text-[11px]">
                Breakdown of Monthly Tax Calculations
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <div>
                    <span className="text-white font-semibold">Turnover Tax (TOT - 3% on Gross Sales)</span>
                    <span className="text-[10px] text-stone-400 block">KRA Section 12C for Small & Medium Salons</span>
                  </div>
                  <span className="font-mono font-bold text-amber-200">
                    KSh {monthlyTaxSummary.turnoverTax3PercentKSh.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <div>
                    <span className="text-white font-semibold">Staff PAYE (Pay As You Earn)</span>
                    <span className="text-[10px] text-stone-400 block">After applying KSh 2,400 monthly personal relief</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    KSh {monthlyTaxSummary.totalPAYEKSh.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <div>
                    <span className="text-white font-semibold">Affordable Housing Levy (AHL - 3.0% combined)</span>
                    <span className="text-[10px] text-stone-400 block">1.5% employee deducted + 1.5% employer matched</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    KSh {monthlyTaxSummary.totalHousingLevyCombinedKSh.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <div>
                    <span className="text-white font-semibold">Social Health Insurance Fund (SHIF - 2.75%)</span>
                    <span className="text-[10px] text-stone-400 block">Statutory health contribution for all staff</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    KSh {monthlyTaxSummary.totalSHIFKSh.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-white font-semibold">NSSF Pension Contribution (Tier I & II)</span>
                    <span className="text-[10px] text-stone-400 block">Combined employee and employer pension</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    KSh {monthlyTaxSummary.totalNSSFKSh.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-amber-300" />
                <span>Pay via M-Pesa Paybill <strong className="text-white font-mono">222222</strong> · Account: <strong className="text-amber-300 font-mono">PRN-2611-9597237</strong></span>
              </div>
              <span className="text-stone-400 text-[11px]">
                Due date: On or before the 20th of the following month
              </span>
            </div>
          </div>

          {/* Comparison Card: Turnover Tax vs 30% Corporate Tax */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-800" />
              Tax Regime Comparison for Tinez Kapuya
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Turnover Tax (TOT - 3% on Sales) [Recommended]</span>
                  <span className="font-mono">KSh {monthlyTaxSummary.turnoverTax3PercentKSh.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Best for beauty salons: Simplest KRA filing without requiring full audited books. Calculated strictly as 3% of recorded cash & M-Pesa sales.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>Standard Corporate Tax (30% of Net Profit)</span>
                  <span className="font-mono">KSh {monthlyTaxSummary.corporateTax30PercentKSh.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Alternative regime: 30% on Net Profit (KSh {monthlyTaxSummary.netOperatingProfitKSh.toLocaleString()}) after deducting all allowable expenses. Requires annual audited returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STAFF PAYROLL */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Total Gross Payroll</span>
              <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                KSh {computedPayroll.reduce((acc, p) => acc + p.grossPay, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">{computedPayroll.length} Active Staff</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Total Commission Earned</span>
              <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                KSh {computedPayroll.reduce((acc, p) => acc + p.commissionEarned, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Performance-based</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium block">Kenya Statutory Deductions</span>
              <span className="text-xl font-bold font-mono text-amber-900 tabular-nums">
                KSh {computedPayroll.reduce((acc, p) => acc + p.totalDeductions, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">PAYE, SHIF, AHL, NSSF</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] text-emerald-800 font-bold block">Net Staff Payout</span>
              <span className="text-xl font-bold font-mono text-emerald-950 tabular-nums">
                KSh {computedPayroll.reduce((acc, p) => acc + p.netPay, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Disbursed via M-Pesa/Bank</span>
            </div>
          </div>

          {/* Detailed Staff Roster Table */}
          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Staff Remuneration Matrix (Salary vs. Commission)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Calculated using Kenyan statutory deductions with monthly personal relief.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-3">Pay Structure</th>
                    <th className="py-3 px-3">Base Pay</th>
                    <th className="py-3 px-3">Commissions</th>
                    <th className="py-3 px-3">Gross Pay</th>
                    <th className="py-3 px-3">Deductions</th>
                    <th className="py-3 px-3 text-right">Net Payable</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {computedPayroll.map((item) => {
                    const isPaid = paidStatus[item.staff.id];
                    return (
                      <tr key={item.staff.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{item.staff.name}</div>
                          <div className="text-[10px] text-stone-500">{item.staff.position}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.staff.payType === 'salary'
                              ? 'bg-blue-100 text-blue-900'
                              : item.staff.payType === 'commission'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {item.staff.payType === 'salary' ? 'Fixed Salary' : item.staff.payType === 'commission' ? 'Commission Only' : 'Base + Commission'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {item.staff.baseSalaryKSh > 0 ? `KSh ${item.staff.baseSalaryKSh.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-800">
                          {item.commissionEarned > 0 ? `KSh ${item.commissionEarned.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">
                          KSh {item.grossPay.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono text-red-700">
                          -KSh {item.totalDeductions.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-900 text-right">
                          KSh {item.netPay.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedStaffForPayslip(item)}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                            >
                              Payslip
                            </button>
                            <button
                              onClick={() => handleMarkPaid(item.staff.id)}
                              disabled={isPaid}
                              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {isPaid ? 'Paid' : 'Mark Paid'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KRA TAXES & REMITTANCE */}
      {activeSubTab === 'kraTax' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Statutory Remittance Breakdown */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                Staff Payroll Statutory Deductions
              </h3>

              <div className="divide-y divide-stone-200 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 block">KRA PAYE (Income Tax)</span>
                    <span className="text-[11px] text-stone-500">Includes KSh 2,400 monthly personal relief</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    KSh {monthlyTaxSummary.totalPAYEKSh.toLocaleString()}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 block">Affordable Housing Levy (AHL)</span>
                    <span className="text-[11px] text-stone-500">1.5% employee + 1.5% employer matching</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    KSh {monthlyTaxSummary.totalHousingLevyCombinedKSh.toLocaleString()}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 block">Social Health Insurance Fund (SHIF)</span>
                    <span className="text-[11px] text-stone-500">2.75% of gross earnings</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    KSh {monthlyTaxSummary.totalSHIFKSh.toLocaleString()}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 block">National Social Security Fund (NSSF)</span>
                    <span className="text-[11px] text-stone-500">Tier I + Tier II combined employer/employee</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    KSh {monthlyTaxSummary.totalNSSFKSh.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Turnover Tax & KRA PRN Generator */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800" />
                Salon Turnover Tax & KRA Payment Slip
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Gross Recorded Sales ({formatMonthLabel(selectedMonth)}):</span>
                    <span className="font-mono font-semibold">KSh {monthlyTaxSummary.totalSalesKSh.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-800 font-bold pt-1 border-t border-stone-200">
                    <span>Turnover Tax (3% of Gross):</span>
                    <span className="font-mono text-emerald-900">KSh {monthlyTaxSummary.turnoverTax3PercentKSh.toLocaleString()}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-200 block">
                    Total KRA Liability to Remit
                  </span>
                  <div className="text-2xl font-bold font-mono text-amber-200">
                    KSh {monthlyTaxSummary.totalKRAPayableKSh.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Due for current tax period. Prepared for filing on KRA iTax / eTIMS.
                  </p>
                </div>

                {/* M-Pesa KRA Remittance Details */}
                <div className="p-3 border border-stone-200 rounded-lg text-[11px] space-y-1.5 bg-stone-50/70">
                  <div className="font-bold text-stone-900">How to Pay KRA via M-Pesa:</div>
                  <div>1. Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; <strong>Paybill: 222222</strong></div>
                  <div>2. Account Number: <strong className="font-mono text-emerald-900">PRN-2611-9597237</strong></div>
                  <div>3. Amount: <strong className="font-mono">KSh {monthlyTaxSummary.totalKRAPayableKSh.toLocaleString()}</strong></div>
                  <div>4. Enter your M-Pesa PIN and receive KRA confirmation SMS.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Payslip Modal */}
      {selectedStaffForPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/bareglow_logo_trimmed.png"
                  alt="Bareglow Logo"
                  className="h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Bareglow Staff Payslip</h3>
                  <p className="text-[10px] text-stone-500">{SALON_INFO.address}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffForPayslip(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-lg text-[11px]">
                <div>
                  <span className="text-stone-500 block">Employee:</span>
                  <span className="font-bold text-stone-900">{selectedStaffForPayslip.staff.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Position:</span>
                  <span className="font-medium text-stone-800">{selectedStaffForPayslip.staff.position}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">KRA PIN:</span>
                  <span className="font-mono font-medium">{selectedStaffForPayslip.staff.kraPin || 'A014892301Z'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">NSSF Number:</span>
                  <span className="font-mono font-medium">{selectedStaffForPayslip.staff.nssfNumber || '10482910'}</span>
                </div>
              </div>

              {/* Earnings */}
              <div>
                <span className="font-bold text-stone-900 block mb-1">1. Earnings</span>
                <div className="border border-stone-200 rounded-lg p-2.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>Base Salary:</span>
                    <span className="font-mono">KSh {selectedStaffForPayslip.staff.baseSalaryKSh.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Commission on Services & Retail:</span>
                    <span className="font-mono text-emerald-800 font-semibold">
                      KSh {selectedStaffForPayslip.commissionEarned.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-stone-200 flex items-center justify-between font-bold text-stone-900">
                    <span>Gross Earnings:</span>
                    <span className="font-mono">KSh {selectedStaffForPayslip.grossPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <span className="font-bold text-stone-900 block mb-1">2. Kenya Statutory Deductions</span>
                <div className="border border-stone-200 rounded-lg p-2.5 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>PAYE (Income Tax with Relief):</span>
                    <span className="font-mono text-red-700">-KSh {selectedStaffForPayslip.paye.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Housing Levy (AHL - 1.5%):</span>
                    <span className="font-mono text-red-700">-KSh {selectedStaffForPayslip.housingLevy.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SHIF (Social Health 2.75%):</span>
                    <span className="font-mono text-red-700">-KSh {selectedStaffForPayslip.shif.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NSSF (Pension):</span>
                    <span className="font-mono text-red-700">-KSh {selectedStaffForPayslip.nssf.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 border-t border-stone-200 flex items-center justify-between font-bold text-red-800">
                    <span>Total Deductions:</span>
                    <span className="font-mono">-KSh {selectedStaffForPayslip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950">Net Pay to Employee:</span>
                <span className="text-base font-bold font-mono text-emerald-900">
                  KSh {selectedStaffForPayslip.netPay.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
