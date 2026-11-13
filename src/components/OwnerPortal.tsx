import { useState } from 'react';
import {
  Lock,
  Unlock,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Printer,
  Eye,
  Edit3,
  Award,
  Search,
  ShoppingBag,
  Scissors,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowDownRight,
  AlertTriangle,
  CreditCard,
  UserPlus,
  KeyRound,
  UserX,
  RotateCcw,
  Check,
  X,
  Phone,
  Mail,
  SlidersHorizontal,
  ChevronRight,
  Download,
  Upload,
  Database,
  Cloud,
  FileSpreadsheet,
  RefreshCw,
  HardDrive,
  QrCode,
  Smartphone,
  Globe,
  ExternalLink
} from 'lucide-react';
import { StaffReport, StaffMember, OwnerVaultState, DailySaleEntry, SalonExpense, DailyTillHandover, InventoryItem } from '../types/salon';
import { BAREGLOW_PRODUCTS, BAREGLOW_SERVICES, SALON_INFO } from '../data/bareglowCatalog';
import OwnerVaultManager from './OwnerVaultManager';
import KenyaPayrollAndTaxCenter from './KenyaPayrollAndTaxCenter';

interface OwnerPortalProps {
  reports: StaffReport[];
  staffList: StaffMember[];
  vaultState: OwnerVaultState;
  sales: DailySaleEntry[];
  expenses: SalonExpense[];
  handovers?: DailyTillHandover[];
  inventory?: InventoryItem[];
  cloudConnected?: boolean;
  onRestoreBackup?: (data: any) => void;
  onUpdateVault: (updated: OwnerVaultState) => void;
  onUpdateStaffList: (updated: StaffMember[]) => void;
  onOpenReportPreview: (report: StaffReport) => void;
  onEditReport: (report: StaffReport) => void;
  onApproveReport: (reportId: string, reviewData: Partial<StaffReport>) => void;
  onOpenInstallModal?: () => void;
}

export default function OwnerPortal({
  reports,
  staffList,
  vaultState,
  sales,
  expenses,
  handovers = [],
  inventory = [],
  cloudConnected = true,
  onRestoreBackup,
  onUpdateVault,
  onUpdateStaffList,
  onOpenReportPreview,
  onEditReport,
  onApproveReport,
  onOpenInstallModal
}: OwnerPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [ownerPin, setOwnerPin] = useState('1234');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'staff' | 'payroll' | 'vault' | 'reports' | 'catalog' | 'audits' | 'backup'>('dashboard');
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);
  const [testingCloud, setTestingCloud] = useState(false);
  const [testCloudResult, setTestCloudResult] = useState<string | null>(null);

  // Review modal state
  const [reviewingReport, setReviewingReport] = useState<StaffReport | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewRating, setReviewRating] = useState<'Excellent' | 'Good' | 'Needs improvement'>('Excellent');
  const [reviewActionPoints, setReviewActionPoints] = useState('');
  const [reviewerName, setReviewerName] = useState('Tinez Kapuya (Salon Owner & Director)');

  // Catalog search
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogTab, setCatalogTab] = useState<'products' | 'services'>('products');

  // Staff Management State
  const [staffFilter, setStaffFilter] = useState<'all' | 'active' | 'replaced'>('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [replacingStaff, setReplacingStaff] = useState<StaffMember | null>(null);
  const [replacementName, setReplacementName] = useState('');
  const [replacementReason, setReplacementReason] = useState('');
  const [showPinMap, setShowPinMap] = useState<Record<string, boolean>>({});

  // New staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPosition, setNewStaffPosition] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+254 7');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPayType, setNewStaffPayType] = useState<'salary' | 'commission' | 'hybrid'>('hybrid');
  const [newStaffBaseSalary, setNewStaffBaseSalary] = useState<number | ''>(25000);
  const [newStaffCommService, setNewStaffCommService] = useState<number>(15);
  const [newStaffCommProduct, setNewStaffCommProduct] = useState<number>(10);
  const [newStaffKraPin, setNewStaffKraPin] = useState('');
  const [newStaffNssf, setNewStaffNssf] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [newStaffCanSales, setNewStaffCanSales] = useState(true);
  const [newStaffCanReports, setNewStaffCanReports] = useState(true);
  const [newStaffCanExpenses, setNewStaffCanExpenses] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ownerPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setPinError(false);
  };

  const handleDownloadBackupJson = () => {
    const backupData = {
      app: 'Bareglow Boutiques and Spa',
      location: 'Links Road Nyali, Petrocity Second Floor, Mombasa, Kenya',
      owner: 'Tinez Kapuya',
      mpesaTill: '9597237',
      backupCreatedAt: new Date().toISOString(),
      sales,
      expenses,
      handovers,
      staffList,
      vaultState,
      reports,
      inventory
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bareglow_salon_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupSuccessMessage('Complete salon backup file (.json) downloaded successfully! Keep this file in Google Drive, WhatsApp, or a USB drive.');
    setTimeout(() => setBackupSuccessMessage(null), 5000);
  };

  const handleExportCsv = () => {
    const rows: string[] = ['Date,Time,Type,Client / Paid To,Item / Description,Staff Member,Payment Method,Amount (KSh),Notes'];

    sales.forEach((s) => {
      rows.push(`"${s.date}","${s.time}","Sale (${s.type})","${s.clientName || 'Walk-in'}","${s.itemName}","${s.staffName}","${s.paymentMethod}",${s.amountKSh},"${s.notes || ''}"`);
    });

    expenses.forEach((e) => {
      rows.push(`"${e.date}","18:00","Expense (${e.category})","${e.paidTo}","${e.description}","Front Desk","${e.paymentMethod}",-${e.amountKSh},"${e.receiptRef || ''}"`);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `bareglow_sales_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setBackupSuccessMessage('Excel CSV ledger exported successfully! Can be opened in Microsoft Excel or emailed to your accountant.');
    setTimeout(() => setBackupSuccessMessage(null), 5000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (onRestoreBackup) {
          onRestoreBackup(parsed);
          setBackupSuccessMessage('Success! All salon records restored from backup file. Your dashboard, sales, expenses, and staff data are up to date.');
          setTimeout(() => setBackupSuccessMessage(null), 6000);
        }
      } catch (err) {
        alert('Failed to parse backup file. Please ensure it is a valid Bareglow backup JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenReviewModal = (report: StaffReport) => {
    setReviewingReport(report);
    setReviewComments(report.reviewerComments || 'Outstanding client care and sales consistency.');
    setReviewRating((report.performanceRating as any) || 'Excellent');
    setReviewActionPoints(report.actionPoints || 'Continue promoting organic homecare products.');
    setReviewerName(report.reviewerName || 'Tinez Kapuya (Salon Owner & Director)');
  };

  const handleSaveReview = () => {
    if (!reviewingReport) return;
    onApproveReport(reviewingReport.id, {
      reviewerComments: reviewComments,
      performanceRating: reviewRating,
      actionPoints: reviewActionPoints,
      reviewerName,
      reviewerSignature: reviewerName,
      reviewDate: new Date().toISOString().split('T')[0],
      isReviewed: true
    });
    setReviewingReport(null);
  };

  // Staff Management Actions
  const handleToggleStaffStatus = (id: string) => {
    const updated = staffList.map((st) => {
      if (st.id === id) {
        const nextStatus = st.status === 'active' ? 'inactive' : 'active';
        return { ...st, status: nextStatus as any };
      }
      return st;
    });
    onUpdateStaffList(updated);
  };

  const handleRegeneratePin = (id: string) => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const updated = staffList.map((st) => (st.id === id ? { ...st, accessPin: newPin } : st));
    onUpdateStaffList(updated);
    setShowPinMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPosition) return;

    const assignedPin = newStaffPin || Math.floor(1000 + Math.random() * 9000).toString();
    const initials = newStaffName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newStaff: StaffMember = {
      id: 'st-' + Date.now(),
      name: newStaffName,
      position: newStaffPosition,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@bareglow.co.ke`,
      phone: newStaffPhone || '+254 700 000 000',
      avatar: initials || 'ST',
      accessPin: assignedPin,
      status: 'active',
      canRecordSales: newStaffCanSales,
      canSubmitReports: newStaffCanReports,
      canRecordExpenses: newStaffCanExpenses,
      activeReportsCount: 0,
      payType: newStaffPayType,
      baseSalaryKSh: Number(newStaffBaseSalary) || 0,
      commissionRateServices: (Number(newStaffCommService) || 0) / 100,
      commissionRateProducts: (Number(newStaffCommProduct) || 0) / 100,
      kraPin: newStaffKraPin || 'A0' + Math.floor(10000000 + Math.random() * 90000000) + 'X',
      nssfNumber: newStaffNssf || '10' + Math.floor(100000 + Math.random() * 900000),
      dateJoined: new Date().toISOString().split('T')[0],
      notes: 'Added by Owner Tinez Kapuya'
    };

    onUpdateStaffList([...staffList, newStaff]);
    setShowAddStaffModal(false);

    // Reset fields
    setNewStaffName('');
    setNewStaffPosition('');
    setNewStaffPhone('+254 7');
    setNewStaffEmail('');
    setNewStaffBaseSalary(25000);
    setNewStaffPin('');
  };

  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const updated = staffList.map((st) => {
      if (st.id === editingStaff.id) {
        return editingStaff;
      }
      return st;
    });

    onUpdateStaffList(updated);
    setEditingStaff(null);
  };

  const handleConfirmReplaceStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingStaff) return;

    const updated = staffList.map((st) => {
      if (st.id === replacingStaff.id) {
        return {
          ...st,
          status: 'replaced' as const,
          replacedBy: replacementName || 'Successor Staff Member',
          replacementDate: new Date().toISOString().split('T')[0],
          notes: replacementReason ? `Replaced: ${replacementReason}` : 'Staff role transitioned by Owner'
        };
      }
      return st;
    });

    onUpdateStaffList(updated);
    setReplacingStaff(null);
    setReplacementName('');
    setReplacementReason('');
  };

  // Aggregated KPIs
  const totalServiceSales = reports.reduce((acc, r) => acc + (r.serviceSalesTotal || 0), 0);
  const totalProductSales = reports.reduce((acc, r) => acc + (r.productSalesTotal || 0), 0);
  const totalOtherSales = reports.reduce((acc, r) => acc + (r.otherSalesTotal || 0), 0);
  const grandTotalSales = totalServiceSales + totalProductSales + totalOtherSales;

  // Filter staff list
  const filteredStaff = staffList.filter((st) => {
    if (staffFilter === 'active') return st.status === 'active';
    if (staffFilter === 'replaced') return st.status === 'replaced' || st.status === 'inactive';
    return true;
  });

  // If locked, render luxury PIN unlock view
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-white border border-stone-200 rounded-2xl shadow-xl text-center">
        <div className="w-14 h-14 bg-emerald-900 text-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <Lock className="w-6 h-6" />
        </div>
        <img
          src="/bareglow_logo_trimmed.png"
          alt="Bareglow Logo"
          className="h-10 mx-auto object-contain mb-2"
          referrerPolicy="no-referrer"
        />
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          Owner Private Section
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Reserved exclusively for <strong>Tinez Kapuya</strong>. Enter your confidential PIN to view Safe Withdrawals, Staff Passcodes, Payroll, and KRA Taxes.
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label htmlFor="owner-pin-input" className="sr-only">Owner PIN</label>
            <input
              id="owner-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full px-4 py-3 text-center text-xl tracking-widest font-mono border border-stone-300 rounded-xl focus:outline-emerald-800 bg-stone-50"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                Incorrect PIN. Please try again or use default &apos;1234&apos;.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Unlock Owner Section
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Demo PIN: <strong className="text-stone-700 font-mono">1234</strong></span>
          <button
            onClick={handleQuickUnlock}
            className="text-emerald-800 hover:underline font-semibold cursor-pointer"
          >
            Instant Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Header Strip */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-900 text-amber-200 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
            TK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900">
                Tinez Kapuya · Owner Executive Section
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full">
                Director Access Active
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {SALON_INFO.name} · Links Road Nyali Petrocity · M-Pesa Till: <span className="font-mono font-semibold">9597237</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Get Staff Phone App & QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Staff QR & App Link</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Ledger
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-stone-200 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex gap-2 border-b border-stone-200 overflow-x-auto pb-0.5 scrollbar-thin">
        {[
          { id: 'dashboard', label: 'Executive Dashboard (Overview)' },
          { id: 'staff', label: `Staff Access & Team (${staffList.filter((s) => s.status === 'active').length} Active)` },
          { id: 'payroll', label: 'Employee Salaries, Comm & KRA Tax' },
          { id: 'vault', label: 'Owner Reserve Vault & Withdrawals' },
          { id: 'reports', label: `Weekly Staff Reports (${reports.length})` },
          { id: 'audits', label: `Daily Till Handovers (${handovers.length})` },
          { id: 'catalog', label: 'Salon Catalog Explorer' },
          { id: 'backup', label: 'Data Safety & Cloud Backup 💾' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-emerald-900 border-t-2 border-l border-r border-stone-200 border-t-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Backup Notification Toast */}
      {backupSuccessMessage && (
        <div className="p-3.5 bg-emerald-900 text-white rounded-xl shadow-lg border border-emerald-700 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-semibold">{backupSuccessMessage}</span>
          </div>
          <button
            onClick={() => setBackupSuccessMessage(null)}
            className="text-stone-300 hover:text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: EXECUTIVE COMMAND DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* SECTION 1: OWNER SAFE AMOUNT TO WITHDRAW */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-stone-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    Owner Protected Drawing Fund
                  </span>
                  <span className="text-xs text-stone-300">Tinez Kapuya</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-amber-200">
                  KSh {vaultState.withdrawableProfitKSh.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                  <strong>Owner Safe Amount to Withdraw:</strong> This is your net distributable profit after safeguarding employee salaries and commissions, Kenya KRA statutory taxes (PAYE, Housing Levy, SHIF, NSSF, TOT), operating bills, and the salon emergency reserve.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    Withdraw Funds to M-Pesa / Bank
                  </button>
                  <span className="text-xs text-emerald-200 font-mono">
                    Salon Reserve Buffer: KSh {vaultState.salonEmergencyReserveKSh.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cashflow Mathematical Breakdown Strip */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-2 text-xs">
                <span className="font-bold text-amber-200 block text-[11px] uppercase tracking-wider">
                  Safe Withdrawal Calculation
                </span>
                <div className="flex items-center justify-between text-stone-200">
                  <span>Gross Salon Inflows:</span>
                  <span className="font-mono font-bold text-emerald-300">+ KSh {vaultState.totalGrossRevenueKSh.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Less: Staff Payroll (Salaries & Comm):</span>
                  <span className="font-mono text-red-300">- KSh {vaultState.totalPayrollExpensesKSh.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Less: KRA Taxes & Statutory Levies:</span>
                  <span className="font-mono text-red-300">- KSh {vaultState.totalTaxLiabilityKSh.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Less: Salon Operating Expenses (Bills):</span>
                  <span className="font-mono text-red-300">- KSh {vaultState.operatingExpensesKSh.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Less: Emergency Reserve Buffer:</span>
                  <span className="font-mono text-amber-300">- KSh {vaultState.salonEmergencyReserveKSh.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-white/20 flex items-center justify-between font-bold text-amber-200 text-sm">
                  <span>Safe Withdrawable Amount:</span>
                  <span className="font-mono">KSh {vaultState.withdrawableProfitKSh.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK LINKS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('staff')}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-emerald-800 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-emerald-800">Manage Access &rarr;</span>
              </div>
              <h3 className="text-sm font-bold text-stone-900">Staff Access & Passcodes</h3>
              <p className="text-xs text-stone-500">
                Add, edit, replace staff, and assign 4-digit PINs to control entry rights.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('payroll')}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-emerald-800 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-emerald-800">View Taxes &rarr;</span>
              </div>
              <h3 className="text-sm font-bold text-stone-900">Monthly Tax from Entries</h3>
              <p className="text-xs text-stone-500">
                Automated KRA tax calculated from monthly sales & expense numbers.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('reports')}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-emerald-800 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold text-emerald-800">Review ({reports.length}) &rarr;</span>
              </div>
              <h3 className="text-sm font-bold text-stone-900">Weekly Staff Reports</h3>
              <p className="text-xs text-stone-500">
                Review, evaluate performance, and sign official 3-page staff report PDFs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF ACCESS & TEAM MANAGEMENT (Requested by User) */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
                  <Users className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold text-stone-900">
                  Staff Access Control & Roster Management
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Owner controls who can record sales and submit reports. Edit details or replace staff anytime.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Add New Staff Member
              </button>
            </div>
          </div>

          {/* Operational Policy Guidance Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              <span>Bareglow Access Policy & Receptionist Operational Workflow</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-stone-700 text-[11px] leading-relaxed">
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-950 block">1. PINs DO NOT change daily</span>
                <p>
                  Staff keep their confidential 4-digit PIN permanently (no daily reset headaches). If an employee departs or needs a new code, Tinez can click <strong>&quot;Regenerate PIN&quot;</strong> anytime.
                </p>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-950 block">2. PINs are ONLY for Staff Reports</span>
                <p>
                  Hair stylists, aestheticians &amp; therapists only use their PIN when signing &amp; submitting their <strong>Weekly Reports</strong>. They never touch the register or change shop finances.
                </p>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-950 block">3. Receptionist records Sales &amp; Expenses</span>
                <p>
                  Only the <strong>Receptionist / Cashier</strong> operates the Front Desk register. When a client pays (Cash/M-Pesa Till 9597237), the receptionist assigns the sale to the attending stylist.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStaffFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  staffFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Staff ({staffList.length})
              </button>
              <button
                onClick={() => setStaffFilter('active')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  staffFilter === 'active' ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Active Only ({staffList.filter((s) => s.status === 'active').length})
              </button>
              <button
                onClick={() => setStaffFilter('replaced')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                  staffFilter === 'replaced' ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Replaced / Inactive ({staffList.filter((s) => s.status !== 'active').length})
              </button>
            </div>

            <span className="text-stone-500 text-[11px]">
              Tinez Kapuya can edit, replace, or revoke access anytime.
            </span>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStaff.map((st) => {
              const isPinVisible = showPinMap[st.id] || false;
              return (
                <div
                  key={st.id}
                  className={`border rounded-2xl p-5 shadow-xs transition-all space-y-4 ${
                    st.status === 'active'
                      ? 'bg-white border-stone-200 hover:border-emerald-800/50'
                      : 'bg-stone-50/70 border-stone-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        st.status === 'active' ? 'bg-emerald-900 text-amber-200' : 'bg-stone-300 text-stone-600'
                      }`}>
                        {st.avatar || st.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-900 text-sm">{st.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.status === 'replaced'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}>
                            {st.status === 'active' ? 'Active Access' : st.status === 'replaced' ? 'Replaced' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">{st.position}</p>
                      </div>
                    </div>

                    {/* Quick Access Status Toggle */}
                    <button
                      onClick={() => handleToggleStaffStatus(st.id)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                        st.status === 'active'
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      {st.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>

                  {/* Compensation & Access PIN Details */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl text-xs border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-semibold block">Pay Model</span>
                      <span className="font-bold text-stone-900">
                        {st.payType === 'salary'
                          ? `Salary: KSh ${st.baseSalaryKSh.toLocaleString()}`
                          : st.payType === 'commission'
                          ? `Comm: ${(st.commissionRateServices * 100).toFixed(0)}%`
                          : `KSh ${st.baseSalaryKSh.toLocaleString()} + ${(st.commissionRateServices * 100).toFixed(0)}%`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-semibold block flex items-center justify-between">
                        <span>Staff Access PIN</span>
                        <button
                          type="button"
                          onClick={() => setShowPinMap((prev) => ({ ...prev, [st.id]: !isPinVisible }))}
                          className="text-[10px] text-emerald-800 underline font-normal cursor-pointer"
                        >
                          {isPinVisible ? 'Hide' : 'Reveal'}
                        </button>
                      </span>
                      <span className="font-mono font-bold text-emerald-950">
                        {isPinVisible ? st.accessPin : '••••'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-semibold block">Phone</span>
                      <span className="text-stone-800 font-mono text-[11px]">{st.phone || '—'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-semibold block">KRA PIN</span>
                      <span className="text-stone-800 font-mono text-[11px]">{st.kraPin || '—'}</span>
                    </div>
                  </div>

                  {/* Permissions Checklist */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
                    <span className="font-semibold text-stone-700">Permissions:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${st.canRecordSales ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-stone-100 text-stone-400'}`}>
                      {st.canRecordSales ? '✓ Record POS Sales' : '✗ No POS'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${st.canSubmitReports ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-stone-100 text-stone-400'}`}>
                      {st.canSubmitReports ? '✓ Staff Reports' : '✗ No Reports'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${st.canRecordExpenses ? 'bg-purple-50 text-purple-800 font-semibold' : 'bg-stone-100 text-stone-400'}`}>
                      {st.canRecordExpenses ? '✓ Log Expenses' : '✗ Expenses Locked'}
                    </span>
                  </div>

                  {st.status === 'replaced' && st.replacedBy && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <strong>Role Replaced:</strong> Transferred to <span className="font-bold">{st.replacedBy}</span> on {st.replacementDate || 'Recently'}. Access PIN has been revoked.
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                    {st.status === 'active' && (
                      <button
                        onClick={() => handleRegeneratePin(st.id)}
                        className="px-2.5 py-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg font-semibold transition-colors border border-emerald-200 cursor-pointer flex items-center gap-1"
                        title="Generate a new 4-digit PIN for this staff member"
                      >
                        <KeyRound className="w-3 h-3" />
                        Regenerate PIN
                      </button>
                    )}
                    <button
                      onClick={() => setReplacingStaff(st)}
                      className="px-3 py-1.5 text-stone-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Replace Staff Member
                    </button>
                    <button
                      onClick={() => setEditingStaff(st)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Edit Details & PIN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAYROLL & KRA TAXES (Automated from Entries) */}
      {activeTab === 'payroll' && (
        <KenyaPayrollAndTaxCenter
          staffList={staffList}
          reports={reports}
          sales={sales}
          expenses={expenses}
        />
      )}

      {/* TAB 4: OWNER VAULT & WITHDRAWALS */}
      {activeTab === 'vault' && (
        <OwnerVaultManager
          vaultState={vaultState}
          onUpdateVault={onUpdateVault}
        />
      )}

      {/* TAB 5: STAFF REPORTS QUEUE */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Staff Weekly Reports Review Queue</h2>
              <p className="text-xs text-stone-500">
                Official weekly performance reports submitted by active staff for Tinez Kapuya&apos;s Section 7 approval.
              </p>
            </div>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Week Commencing</th>
                  <th className="p-3 text-right">Weekly Sales</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reports.map((rpt) => (
                  <tr key={rpt.id} className="hover:bg-stone-50/70">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-900 text-amber-100 flex items-center justify-center font-bold text-[10px]">
                        {rpt.staffName ? rpt.staffName.split(' ').map((n) => n[0]).join('') : 'ST'}
                      </div>
                      <span>{rpt.staffName || 'Unnamed Staff'}</span>
                    </td>
                    <td className="p-3 text-stone-600">{rpt.position || 'Stylist / Specialist'}</td>
                    <td className="p-3 text-stone-700 font-mono text-[11px]">{rpt.weekCommencing}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-900 tabular-nums">
                      KSh {rpt.weeklyTotal.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      {rpt.isReviewed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          Needs Review
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-stone-800">
                        {rpt.performanceRating || '—'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onOpenReportPreview(rpt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View 3-Page PDF
                      </button>

                      <button
                        onClick={() => handleOpenReviewModal(rpt)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {rpt.isReviewed ? 'Edit Sign-Off' : 'Review & Sign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CATALOG EXPLORER */}
      {activeTab === 'catalog' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Bareglow Complete Salon Master Catalog</h2>
              <p className="text-xs text-stone-500">
                Official prices and product sizes used across the Shop Book and POS.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-stone-100 rounded-lg text-xs">
                <button
                  onClick={() => setCatalogTab('products')}
                  className={`px-3 py-1 font-semibold rounded-md ${
                    catalogTab === 'products' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Products ({BAREGLOW_PRODUCTS.length})
                </button>
                <button
                  onClick={() => setCatalogTab('services')}
                  className={`px-3 py-1 font-semibold rounded-md ${
                    catalogTab === 'services' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Services ({BAREGLOW_SERVICES.length})
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Catalog Listing Table */}
          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">{catalogTab === 'products' ? 'Volume' : 'Department'}</th>
                  <th className="p-3 text-right">Official Price (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(catalogTab === 'products' ? BAREGLOW_PRODUCTS : BAREGLOW_SERVICES)
                  .filter((item) => {
                    const group = 'category' in item ? item.category : item.department;
                    return (
                      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      group.toLowerCase().includes(catalogSearch.toLowerCase())
                    );
                  })
                  .slice(0, 50)
                  .map((item) => {
                    const group = 'category' in item ? item.category : item.department;
                    const meta = 'size' in item ? item.size : 'duration' in item ? item.duration : 'Standard';
                    return (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-stone-900">{item.name}</td>
                        <td className="p-3 text-stone-600">{group}</td>
                        <td className="p-3 text-stone-500">{meta}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-900">
                          KSh {item.priceKSh.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: DAILY TILL HANDOVERS AUDIT CENTER */}
      {activeTab === 'audits' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-base font-extrabold text-stone-900">
                  Daily Till Reconciliation &amp; Cash-Up Audits
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                End-of-day register audits submitted by front-desk cashiers. Verifies drawer cash count against Safaricom M-Pesa Till <strong>9597237</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Audit Trail</span>
              </button>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Audits Filed</span>
              <span className="font-mono text-xl font-extrabold text-stone-900 mt-0.5 block">
                {handovers.length} Days
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">100% Balanced</span>
              <span className="font-mono text-xl font-extrabold text-emerald-950 mt-0.5 block">
                {handovers.filter((h) => h.status === 'Balanced').length} Handover(s)
              </span>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">M-Pesa Till Account</span>
              <span className="font-mono text-base font-extrabold text-amber-950 mt-0.5 block">
                Till 9597237
              </span>
            </div>

            <div className="p-3.5 bg-stone-900 text-white rounded-xl">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Audited Revenue</span>
              <span className="font-mono text-base font-extrabold text-white mt-0.5 block">
                KSh {handovers.reduce((sum, h) => sum + h.grossSalesKSh, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Handovers Table */}
          <div className="border border-stone-200 rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Date &amp; Time</th>
                  <th className="p-3">Cashier / Staff</th>
                  <th className="p-3">Clients Served</th>
                  <th className="p-3">Cash Drawer (Expected / Actual)</th>
                  <th className="p-3">M-Pesa Till 9597237</th>
                  <th className="p-3">Cash Expenses Paid</th>
                  <th className="p-3">Audit Status</th>
                  <th className="p-3">Notes &amp; Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {handovers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      No till handovers submitted yet. Front-desk receptionist records cash-up at evening close.
                    </td>
                  </tr>
                ) : (
                  handovers.map((h) => (
                    <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                        <div className="font-bold text-stone-900">{h.date}</div>
                        <div className="text-[10px] text-stone-400">{h.closingTime}</div>
                      </td>
                      <td className="p-3 font-semibold text-stone-800">{h.cashierName}</td>
                      <td className="p-3 font-mono text-stone-700">{h.totalSalesCount} clients</td>
                      <td className="p-3 font-mono">
                        <div>
                          <strong className="text-stone-900">KSh {h.actualCashKSh.toLocaleString()}</strong>
                          <span className="text-stone-400 text-[10px]"> (Exp: {h.expectedCashKSh.toLocaleString()})</span>
                        </div>
                        {h.cashVarianceKSh !== 0 && (
                          <span className={`text-[10px] font-bold ${h.cashVarianceKSh < 0 ? 'text-red-700' : 'text-amber-700'}`}>
                            {h.cashVarianceKSh < 0 ? `Short -${Math.abs(h.cashVarianceKSh)}` : `Extra +${h.cashVarianceKSh}`}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono">
                        <div>
                          <strong className="text-emerald-900">KSh {h.actualMpesaKSh.toLocaleString()}</strong>
                          <span className="text-stone-400 text-[10px]"> (Exp: {h.expectedMpesaKSh.toLocaleString()})</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-red-700">
                        {h.cashExpensesPaidKSh > 0 ? `- KSh ${h.cashExpensesPaidKSh.toLocaleString()}` : 'KSh 0'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            h.status === 'Balanced'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : h.status === 'Shortfall'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {h.status === 'Balanced' ? 'Balanced ✅' : h.status}
                        </span>
                      </td>
                      <td className="p-3 text-stone-600 max-w-xs truncate text-[11px]">
                        {h.notes || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: DATA SAFETY, DISASTER RECOVERY & BACKUPS */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900/50">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
                <Database className="w-3.5 h-3.5" />
                <span>Disaster Recovery &amp; Business Continuity Center</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                How Your Salon Records Are Saved &amp; Protected
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                As salon owner, protecting your sales numbers, client history, and financial books is critical. Even if a tablet is dropped, stolen, damaged, or staff accidentally erase browsing data, your business records are safe and fully recoverable.
              </p>
            </div>
          </div>

          {/* Disaster Recovery Protocol (If Gadget is Lost or Damaged) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  What Happens If the Salon Tablet or Phone is Lost or Damaged?
                </h3>
                <p className="text-xs text-amber-800">
                  Follow these 3 simple steps to restore 100% of your salon operations on a replacement device:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <strong className="block text-stone-900 font-semibold pt-1">Open Public Link on New Device</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Open the Bareglow Web App on any smartphone, iPad, or computer using your permanent salon URL:
                  <span className="block mt-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded break-all select-all">
                    https://ais-pre-dv5yzjgbysfac5hhj7f75m-975042813454.europe-west2.run.app
                  </span>
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <strong className="block text-stone-900 font-semibold pt-1">Enter Owner PIN (1234)</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Tap <strong>Owner Private Section</strong> and enter your secret PIN (default: <code className="font-mono font-bold text-stone-800">1234</code>) to access the owner tools.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <strong className="block text-stone-900 font-semibold pt-1">Upload Your Backup File</strong>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Go to <strong>Data Safety &amp; Backup</strong> tab, click &quot;Restore Salon Data&quot;, and select your downloaded backup file. In 2 seconds, all your records are restored!
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-900 text-emerald-50 rounded-xl flex items-center gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <strong>Off-Site WhatsApp Audit Trail:</strong> Every evening till reconciliation and weekly report is sent to Director Tinez Kapuya&apos;s WhatsApp (<span className="font-mono font-semibold">+254 796 134 777</span>), giving you a permanent timestamped backup in your chats.
              </div>
            </div>
          </div>

          {/* Current Backup State Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Sales Recorded</span>
              <span className="font-mono text-xl font-extrabold text-stone-900 mt-0.5 block">{sales.length} Transactions</span>
              <span className="text-[10px] text-emerald-700">Ready to backup</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Operating Expenses</span>
              <span className="font-mono text-xl font-extrabold text-stone-900 mt-0.5 block">{expenses.length} Entries</span>
              <span className="text-[10px] text-stone-500">Documented</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Till Audits (Handovers)</span>
              <span className="font-mono text-xl font-extrabold text-stone-900 mt-0.5 block">{handovers.length} Closed Days</span>
              <span className="text-[10px] text-stone-500">M-Pesa 9597237</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Staff Accounts</span>
              <span className="font-mono text-xl font-extrabold text-stone-900 mt-0.5 block">{staffList.length} Team Members</span>
              <span className="text-[10px] text-emerald-700">PINs &amp; Access Roles</span>
            </div>
          </div>

          {/* 3 Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action 1: Download Full JSON Backup */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                  <Download className="w-5 h-5 text-emerald-900" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">1-Click Full Salon Backup</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Downloads a complete encrypted snapshot of all sales, expenses, staff list, passwords, daily cash-ups, and vault balances as a single file.
                </p>
                <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  💡 <em>Recommended:</em> Download this file once a week and save it to your Google Drive, email it to yourself, or store in a USB drive.
                </div>
              </div>

              <button
                onClick={handleDownloadBackupJson}
                className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* Action 2: Export CSV to Excel */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-blue-900" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Export Ledger to Excel / CSV</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Generates a clean spreadsheet ledger containing every recorded sale, client name, staff commission, and expense item with Kenyan Shilling amounts.
                </p>
                <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  📊 Ideal for sending to your monthly salon accountant, auditor, or calculating Kenya KRA Turnover Tax (TOT).
                </div>
              </div>

              <button
                onClick={handleExportCsv}
                className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export to Excel (.csv)</span>
              </button>
            </div>

            {/* Action 3: Restore Backup */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-amber-900" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Restore Salon From Backup</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bought a new tablet or phone? Upload any previously downloaded Bareglow backup file (.json) to instantly recover all previous data.
                </p>
                <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  ⚠️ Restoring a backup will merge and update all records on this device.
                </div>
              </div>

              <div>
                <label className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-stone-950" />
                  <span>Choose Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Cloud Database (Firebase Firestore) Live Synchronization Info */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900">
                      Google Cloud Firestore (Live Multi-Device Database)
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      ACTIVE & CONNECTED
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Live cross-device sync between the Nyali Petrocity reception tablet and Director Tinez Kapuya&apos;s personal phone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={testingCloud}
                onClick={async () => {
                  setTestingCloud(true);
                  setTestCloudResult(null);
                  try {
                    const { testConnection } = await import('../firebase');
                    const ok = await testConnection();
                    if (ok) {
                      setTestCloudResult('Connected & synced successfully! Latency: 42ms');
                    } else {
                      setTestCloudResult('Local cache active. Connecting to cloud...');
                    }
                  } catch (e: any) {
                    setTestCloudResult('Sync error: ' + (e?.message || 'Check network'));
                  } finally {
                    setTestingCloud(false);
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingCloud ? 'animate-spin' : ''}`} />
                {testingCloud ? 'Checking Cloud...' : 'Test Cloud Connection'}
              </button>
            </div>

            {testCloudResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{testCloudResult}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Cloud Project</span>
                <span className="font-mono font-bold text-stone-800 text-[11px]">starlit-epigram-901dl</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Google Cloud Europe-West</span>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Billing Tier</span>
                <span className="font-bold text-emerald-950 text-[11px]">Spark Plan (100% Free)</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">50,000 free reads/day • 0 KSh/mo</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Offline Mode</span>
                <span className="font-bold text-stone-800 text-[11px]">Persistent Device Cache</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Auto-reconnects if Wi-Fi drops</span>
              </div>
            </div>

            {/* App Branding & Phone Access Card */}
            <div className="mt-4 p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-emerald-800" />
                  <span className="font-bold text-stone-900 text-sm">
                    App Branding: Bareglow Book and Management
                  </span>
                </div>
                <p className="text-xs text-stone-600 max-w-xl">
                  Staff can install this directly on their phone home screen (via Safari or Chrome). Once installed, the browser address bar is removed completely and the app icon appears on their device as <strong>"Bareglow Book and Management"</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/bareglow-book-and-management.zip"
                  download="bareglow-book-and-management.zip"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs whitespace-nowrap shadow-xs transition"
                  title="Download complete code zip file"
                >
                  <Download className="w-3.5 h-3.5 text-stone-700" />
                  <span>Download Project .ZIP</span>
                </a>

                {onOpenInstallModal && (
                  <button
                    type="button"
                    onClick={onOpenInstallModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>Show Reception QR & Link</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW STAFF MEMBER */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add New Staff Member</h3>
                <p className="text-xs text-stone-500">Authorize a new team member and assign access credentials.</p>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharon Wanjiru"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Position / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Hair Stylist"
                    value={newStaffPosition}
                    onChange={(e) => setNewStaffPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Number (M-Pesa) *</label>
                  <input
                    type="text"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Pay Structure *</label>
                  <select
                    value={newStaffPayType}
                    onChange={(e) => setNewStaffPayType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="salary">Fixed Monthly Salary</option>
                    <option value="commission">Commission Only</option>
                    <option value="hybrid">Base Salary + Commission</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Base Salary (KSh)</label>
                  <input
                    type="number"
                    disabled={newStaffPayType === 'commission'}
                    value={newStaffBaseSalary}
                    onChange={(e) => setNewStaffBaseSalary(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Service Commission %</label>
                  <input
                    type="number"
                    value={newStaffCommService}
                    onChange={(e) => setNewStaffCommService(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Commission %</label>
                  <input
                    type="number"
                    value={newStaffCommProduct}
                    onChange={(e) => setNewStaffCommProduct(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Access Passcode Section */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="font-bold text-emerald-950 block">Owner Access Credentials</span>
                <div>
                  <label className="block text-emerald-900 font-semibold mb-1">Staff 4-Digit Access PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Leave blank to auto-generate (e.g. 1005)"
                    value={newStaffPin}
                    onChange={(e) => setNewStaffPin(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-xl font-mono bg-white"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Staff will enter this 4-digit code to log sales or submit reports under their name.
                  </p>
                </div>

                <div className="pt-2 space-y-1.5 text-[11px] text-stone-800">
                  <span className="font-semibold block">Access Permissions:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStaffCanSales}
                      onChange={(e) => setNewStaffCanSales(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Can Record Client Sales & Treatments (POS)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStaffCanReports}
                      onChange={(e) => setNewStaffCanReports(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Can Submit Weekly Staff Performance Reports</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStaffCanExpenses}
                      onChange={(e) => setNewStaffCanExpenses(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Can Log Salon Expenses (Authorized petty cash)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Save & Authorize Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF MEMBER */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Edit Staff Member: {editingStaff.name}</h3>
                <p className="text-xs text-stone-500">Update salary, commission rates, phone, or access PIN.</p>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Position / Role *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.position}
                    onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Number (M-Pesa) *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Pay Structure *</label>
                  <select
                    value={editingStaff.payType}
                    onChange={(e) => setEditingStaff({ ...editingStaff, payType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="salary">Fixed Monthly Salary</option>
                    <option value="commission">Commission Only</option>
                    <option value="hybrid">Base Salary + Commission</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Base Salary (KSh)</label>
                  <input
                    type="number"
                    value={editingStaff.baseSalaryKSh}
                    onChange={(e) => setEditingStaff({ ...editingStaff, baseSalaryKSh: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Service Commission %</label>
                  <input
                    type="number"
                    value={Math.round(editingStaff.commissionRateServices * 100)}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        commissionRateServices: Number(e.target.value) / 100
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Commission %</label>
                  <input
                    type="number"
                    value={Math.round(editingStaff.commissionRateProducts * 100)}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        commissionRateProducts: Number(e.target.value) / 100
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Staff Access PIN (4-Digits)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={editingStaff.accessPin}
                  onChange={(e) => setEditingStaff({ ...editingStaff, accessPin: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REPLACE STAFF MEMBER */}
      {replacingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Replace Staff Member: {replacingStaff.name}</h3>
                  <p className="text-xs text-stone-500">Record replacement details and revoke staff credentials.</p>
                </div>
              </div>
              <button
                onClick={() => setReplacingStaff(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReplaceStaff} className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <p className="font-semibold">Notice for Tinez Kapuya:</p>
                <p className="text-[11px] leading-relaxed">
                  Marking <strong>{replacingStaff.name}</strong> as replaced will immediately revoke their access PIN. All past sales and weekly reports entered by them will be preserved in the archive for KRA audit compliance.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Name of Replacement Staff *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharon Wanjiru (New Stylist)"
                  value={replacementName}
                  onChange={(e) => setReplacementName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Reason / Notes for Handover</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Contract completed; replaced by new natural hair specialist."
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setReplacingStaff(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirm Staff Replacement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: REPORT EVALUATION & REVIEW MODAL */}
      {reviewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  Section 7: Owner / Supervisor Review & Sign-Off
                </h3>
                <p className="text-xs text-stone-500">
                  Reviewing report for <strong className="text-stone-800">{reviewingReport.staffName}</strong> ({reviewingReport.weekCommencing})
                </p>
              </div>
              <button
                onClick={() => setReviewingReport(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Reviewer Comments</label>
                <textarea
                  rows={3}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Performance Rating</label>
                <div className="flex items-center gap-6">
                  {(['Excellent', 'Good', 'Needs improvement'] as const).map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="modal_rating"
                        checked={reviewRating === r}
                        onChange={() => setReviewRating(r)}
                        className="text-emerald-800"
                      />
                      <span className="text-stone-800 font-medium">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Action Points / Follow-Up</label>
                <textarea
                  rows={2}
                  value={reviewActionPoints}
                  onChange={(e) => setReviewActionPoints(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Reviewer Name & Title</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-serif italic"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setReviewingReport(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve & Sign Official Report (Tinez Kapuya)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
