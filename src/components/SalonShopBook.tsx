import { useState, useMemo } from 'react';
import {
  BookOpen,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  Calendar,
  Clock,
  CreditCard,
  User,
  Scissors,
  ShoppingBag,
  Printer,
  CheckCircle2,
  Filter,
  Sparkles,
  Moon,
  FileText,
  Receipt,
  MessageCircle,
  Share2,
  X,
  History,
  Crown,
  ChevronRight
} from 'lucide-react';
import { DailySaleEntry, SalonExpense, InventoryItem, StaffMember, DailyTillHandover } from '../types/salon';
import { BAREGLOW_SERVICES, SALON_INFO } from '../data/bareglowCatalog';
import ClientReceiptModal from './ClientReceiptModal';
import TillReconciliationModal from './TillReconciliationModal';

// Date and Time helpers for Salon Record Keeping
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getCurrentTimeInput = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let hour = parseInt(hStr, 10);
  const minutes = mStr || '00';
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  const strHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${strHour}:${minutes} ${ampm}`;
};

interface SalonShopBookProps {
  sales: DailySaleEntry[];
  expenses: SalonExpense[];
  inventory: InventoryItem[];
  staffList: StaffMember[];
  handovers?: DailyTillHandover[];
  onAddSale: (sale: DailySaleEntry) => void;
  onAddExpense: (expense: SalonExpense) => void;
  onSaveHandover?: (handover: DailyTillHandover) => void;
}

export default function SalonShopBook({
  sales,
  expenses,
  inventory,
  staffList,
  handovers = [],
  onAddSale,
  onAddExpense,
  onSaveHandover
}: SalonShopBookProps) {
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'pos'>('sales');

  // Search & Filtering State (Client Treatment History)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState<'all' | 'M-Pesa' | 'Cash'>('all');
  const [filterDateMode, setFilterDateMode] = useState<'all' | 'today'>('all');

  // Modal States
  const [receiptSale, setReceiptSale] = useState<DailySaleEntry | null>(null);
  const [showTillModal, setShowTillModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // New Sale State (POS) with Automatic Date and User-Editable Time
  const [saleDate, setSaleDate] = useState(getTodayDateString());
  const [saleTime, setSaleTime] = useState(getCurrentTimeInput());
  const [saleType, setSaleType] = useState<'Service' | 'Product Retail'>('Service');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedItemName, setSelectedItemName] = useState(BAREGLOW_SERVICES[0].name);
  const [selectedStaff, setSelectedStaff] = useState('Faith Mwangi');
  const [saleAmount, setSaleAmount] = useState<number>(BAREGLOW_SERVICES[0].priceKSh);
  const [salePaymentMethod, setSalePaymentMethod] = useState<'M-Pesa' | 'Cash'>('M-Pesa');
  const [saleNotes, setSaleNotes] = useState('');
  const [lastAddedSale, setLastAddedSale] = useState<DailySaleEntry | null>(null);

  // New Expense State
  const [expenseDate, setExpenseDate] = useState(getTodayDateString());
  const [expenseCategory, setExpenseCategory] = useState<SalonExpense['category']>('Salon Supplies & Products');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expenseMethod, setExpenseMethod] = useState<'M-Pesa' | 'Cash' | 'Bank Transfer'>('M-Pesa');
  const [expenseToast, setExpenseToast] = useState(false);

  // Financial sums
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.amountKSh, 0);
  const mpesaSalesTotal = sales.filter((s) => s.paymentMethod === 'M-Pesa').reduce((sum, s) => sum + s.amountKSh, 0);
  const cashSalesTotal = sales.filter((s) => s.paymentMethod === 'Cash').reduce((sum, s) => sum + s.amountKSh, 0);

  const totalExpensesCost = expenses.reduce((sum, e) => sum + e.amountKSh, 0);
  const netShopBalance = totalSalesRevenue - totalExpensesCost;

  // Filtered sales for Ledger & History search
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      // Query match (Name, phone, service, staff)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.clientName.toLowerCase().includes(q) ||
        (s.clientPhone && s.clientPhone.includes(q)) ||
        s.itemName.toLowerCase().includes(q) ||
        s.staffName.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q));

      // Payment filter
      const matchesPayment = filterPayment === 'all' || s.paymentMethod === filterPayment;

      // Date filter
      const matchesDate = filterDateMode === 'all' || s.date === getTodayDateString();

      return matchesQuery && matchesPayment && matchesDate;
    });
  }, [sales, searchQuery, filterPayment, filterDateMode]);

  // Client VIP Stats Profile (When staff searches for a specific client name)
  const clientVipProfile = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    // Find all records matching client name or phone
    const clientRecords = sales.filter(
      (s) =>
        s.clientName.toLowerCase().includes(q) ||
        (s.clientPhone && s.clientPhone.includes(q))
    );

    if (clientRecords.length === 0) return null;

    // Extract primary client name
    const primaryName = clientRecords[0].clientName;
    const primaryPhone = clientRecords.find((r) => r.clientPhone)?.clientPhone || '';
    const totalSpent = clientRecords.reduce((sum, r) => sum + r.amountKSh, 0);
    const visitCount = clientRecords.length;

    // Determine favorite stylist
    const stylistCounts: Record<string, number> = {};
    clientRecords.forEach((r) => {
      stylistCounts[r.staffName] = (stylistCounts[r.staffName] || 0) + 1;
    });
    const preferredStylist = Object.entries(stylistCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Faith Mwangi';

    // Unique services received
    const servicesReceived = Array.from(new Set(clientRecords.map((r) => r.itemName)));

    return {
      clientName: primaryName,
      clientPhone: primaryPhone,
      totalSpent,
      visitCount,
      preferredStylist,
      servicesReceived,
      lastVisit: `${clientRecords[0].date} (${clientRecords[0].time})`,
      lastService: clientRecords[0].itemName,
      lastNotes: clientRecords[0].notes || ''
    };
  }, [sales, searchQuery]);

  // Handle service/product selection changes in POS
  const handleItemChange = (name: string) => {
    setSelectedItemName(name);
    if (saleType === 'Service') {
      const match = BAREGLOW_SERVICES.find((s) => s.name === name);
      if (match) setSaleAmount(match.priceKSh);
    } else {
      const match = inventory.find((p) => p.name === name);
      if (match) setSaleAmount(match.priceKSh);
    }
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !saleAmount) return;

    const formattedTime = formatTimeTo12Hour(saleTime || getCurrentTimeInput());

    const newSale: DailySaleEntry = {
      id: 'sal-' + Date.now(),
      date: saleDate || getTodayDateString(),
      time: formattedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      type: saleType,
      itemName: selectedItemName,
      staffName: selectedStaff,
      quantity: 1,
      amountKSh: Number(saleAmount),
      paymentMethod: salePaymentMethod,
      notes: saleNotes
    };

    onAddSale(newSale);
    setLastAddedSale(newSale);

    // Reset form
    setClientName('');
    setClientPhone('');
    setSaleNotes('');
    setSaleDate(getTodayDateString());
    setSaleTime(getCurrentTimeInput());
    setActiveTab('sales');

    // Automatically prompt with E-Receipt for instant sharing
    setReceiptSale(newSale);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseAmount);
    if (!amount || amount <= 0 || !expenseDesc) return;

    const newExpense: SalonExpense = {
      id: 'exp-' + Date.now(),
      date: expenseDate,
      category: expenseCategory,
      description: expenseDesc,
      amountKSh: amount,
      paidTo: expensePaidTo || 'Supplier',
      paymentMethod: expenseMethod,
      receiptRef: 'EXP-' + Math.floor(1000 + Math.random() * 9000)
    };

    onAddExpense(newExpense);
    setExpenseDesc('');
    setExpenseAmount('');
    setExpensePaidTo('');
    setShowExpenseModal(false);
    setExpenseToast(true);
    setTimeout(() => setExpenseToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Strict Cash & M-Pesa Accounting Banner */}
      <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs border border-emerald-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className="text-white">Bareglow Policy:</strong> Zero Credit / No Loans · 100% Upfront Collection via M-Pesa Buy Goods Till <strong className="text-amber-300 font-mono text-sm">9597237</strong> or Cash.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTillModal(true)}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            <span>End-of-Day Till Cash-Up</span>
          </button>
        </div>
      </div>

      {/* Staff Friendly Quick Action Hub (Designed for ZERO computer training) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Button 1: POS Record Sale */}
        <button
          onClick={() => {
            setSaleDate(getTodayDateString());
            setSaleTime(getCurrentTimeInput());
            setActiveTab('pos');
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs ${
            activeTab === 'pos'
              ? 'bg-emerald-900 text-white border-emerald-950 ring-2 ring-emerald-700'
              : 'bg-white hover:bg-emerald-50/60 border-stone-200 text-stone-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              activeTab === 'pos' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
            }`}>
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">POS</span>
          </div>
          <div>
            <span className="font-bold text-sm block">Record Sale</span>
            <span className={`text-[11px] block mt-0.5 ${activeTab === 'pos' ? 'text-emerald-200' : 'text-stone-500'}`}>
              Client treatment &amp; retail payment
            </span>
          </div>
        </button>

        {/* Button 2: Pay Expense */}
        <button
          onClick={() => setShowExpenseModal(true)}
          className="p-4 rounded-2xl bg-white hover:bg-red-50/50 border border-stone-200 text-stone-900 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Expense</span>
          </div>
          <div>
            <span className="font-bold text-sm text-stone-900 block">Pay Expense</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Power tokens, staff tea, salon products
            </span>
          </div>
        </button>

        {/* Button 3: Evening Till Reconciliation */}
        <button
          onClick={() => setShowTillModal(true)}
          className="p-4 rounded-2xl bg-white hover:bg-amber-50/60 border border-stone-200 text-stone-900 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Evening</span>
          </div>
          <div>
            <span className="font-bold text-sm text-stone-900 block">Till Cash-Up</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Match drawer &amp; WhatsApp Tinez
            </span>
          </div>
        </button>

        {/* Button 4: Sales Ledger & Client History */}
        <button
          onClick={() => setActiveTab('sales')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs ${
            activeTab === 'sales'
              ? 'bg-stone-900 text-white border-stone-950 ring-2 ring-stone-800'
              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              activeTab === 'sales' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-900'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Register</span>
          </div>
          <div>
            <span className="font-bold text-sm block">Sales Ledger</span>
            <span className={`text-[11px] block mt-0.5 ${activeTab === 'sales' ? 'text-stone-300' : 'text-stone-500'}`}>
              {sales.length} client visits recorded
            </span>
          </div>
        </button>
      </div>

      {/* Financial Snapshot Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Total Salon Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 tabular-nums">
            KSh {totalSalesRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
            <span>M-Pesa: <strong className="text-emerald-900">KSh {mpesaSalesTotal.toLocaleString()}</strong></span>
            <span>·</span>
            <span>Cash: <strong className="text-stone-800">KSh {cashSalesTotal.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Total Salon Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-700 tabular-nums">
            KSh {totalExpensesCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {expenses.length} operating bills &amp; supply items logged
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-900 mb-1">
            <span className="text-xs font-bold">Net Shop Operating Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 tabular-nums">
            KSh {netShopBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">
            Gross Sales minus Operating Bills
          </div>
        </div>
      </div>

      {/* Notifications */}
      {lastAddedSale && (
        <div className="p-3.5 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Sale for <strong>{lastAddedSale.clientName}</strong> (KSh {lastAddedSale.amountKSh.toLocaleString()}) recorded successfully!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReceiptSale(lastAddedSale)}
              className="px-3 py-1 bg-emerald-900 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 hover:bg-emerald-950 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>View &amp; WhatsApp Receipt</span>
            </button>
            <button
              onClick={() => setLastAddedSale(null)}
              className="text-stone-500 hover:text-stone-800 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {expenseToast && (
        <div className="p-3 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
          <span>Salon expense logged into the Expense Book!</span>
        </div>
      )}

      {/* Segmented Tab Navigation */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sales'
              ? 'bg-white text-emerald-950 border-t-2 border-l border-r border-stone-200 border-t-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sales &amp; Client Register ({sales.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'expenses'
              ? 'bg-white text-emerald-950 border-t-2 border-l border-r border-stone-200 border-t-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-red-600" />
          <span>Expenses Book ({expenses.length})</span>
        </button>

        <button
          onClick={() => {
            setSaleDate(getTodayDateString());
            setSaleTime(getCurrentTimeInput());
            setActiveTab('pos');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pos'
              ? 'bg-white text-emerald-950 border-t-2 border-l border-r border-stone-200 border-t-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-700" />
          <span>Front Desk POS (Record Payment)</span>
        </button>
      </div>

      {/* TAB 1: SALES LEDGER & CLIENT SEARCH */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
          {/* Top Bar with Search & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Bareglow Client &amp; Sales Register</h2>
              <p className="text-xs text-stone-500">
                Search client names to view past visits, hair formulas, preferred stylists, and send instant e-receipts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTillModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer border border-amber-300"
              >
                <Moon className="w-3.5 h-3.5 text-amber-800" />
                <span>Evening Cash-Up</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Register</span>
              </button>
            </div>
          </div>

          {/* Quick Search & Filter Controls (Very User Friendly) */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Client Name (e.g. Amina), Phone (+254...), Service, or Stylist..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Payment Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-semibold">Payment:</span>
                <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5 text-[11px]">
                  <button
                    onClick={() => setFilterPayment('all')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      filterPayment === 'all' ? 'bg-emerald-800 text-white' : 'text-stone-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterPayment('M-Pesa')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      filterPayment === 'M-Pesa' ? 'bg-emerald-800 text-white' : 'text-stone-600'
                    }`}
                  >
                    M-Pesa (Till 9597237)
                  </button>
                  <button
                    onClick={() => setFilterPayment('Cash')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      filterPayment === 'Cash' ? 'bg-emerald-800 text-white' : 'text-stone-600'
                    }`}
                  >
                    Cash Only
                  </button>
                </div>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-semibold">Date:</span>
                <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5 text-[11px]">
                  <button
                    onClick={() => setFilterDateMode('all')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      filterDateMode === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600'
                    }`}
                  >
                    All Dates
                  </button>
                  <button
                    onClick={() => setFilterDateMode('today')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                      filterDateMode === 'today' ? 'bg-stone-800 text-white' : 'text-stone-600'
                    }`}
                  >
                    Today Only
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Client VIP Treatment Profile Card (Appears when staff searches for a client!) */}
          {clientVipProfile && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-stone-50 border-2 border-amber-300 rounded-2xl shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-stone-900">{clientVipProfile.clientName}</h3>
                      <span className="px-2 py-0.5 bg-amber-200/80 text-amber-950 font-bold rounded-full text-[10px]">
                        VIP Client
                      </span>
                    </div>
                    {clientVipProfile.clientPhone && (
                      <span className="text-[11px] font-mono text-stone-500">
                        {clientVipProfile.clientPhone}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setClientName(clientVipProfile.clientName);
                    setClientPhone(clientVipProfile.clientPhone);
                    setSelectedStaff(clientVipProfile.preferredStylist);
                    setActiveTab('pos');
                  }}
                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Record New Sale for {clientVipProfile.clientName.split(' ')[0]}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Visits</span>
                  <span className="font-mono font-extrabold text-stone-900 text-sm">
                    {clientVipProfile.visitCount} Appointments
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Spent</span>
                  <span className="font-mono font-extrabold text-emerald-950 text-sm">
                    KSh {clientVipProfile.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Preferred Stylist</span>
                  <span className="font-bold text-stone-900 truncate block">
                    {clientVipProfile.preferredStylist}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Last Visit</span>
                  <span className="text-stone-700 truncate block text-[11px]">
                    {clientVipProfile.lastVisit}
                  </span>
                </div>
              </div>

              {clientVipProfile.lastNotes && (
                <div className="text-[11px] text-amber-950 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <strong className="text-amber-900 font-bold">Treatment &amp; Preference Notes:</strong> {clientVipProfile.lastNotes}
                </div>
              )}
            </div>
          )}

          {/* Sales Table */}
          <div className="border border-stone-200 rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Time &amp; Date</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Service / Retail Item</th>
                  <th className="p-3">Stylist Attended</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      No transactions found matching &quot;{searchQuery}&quot;. Clear search or record a new sale.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                        <div className="font-semibold text-stone-900">{entry.time}</div>
                        <div className="text-[10px] text-stone-400">{entry.date}</div>
                      </td>
                      <td className="p-3 font-semibold text-stone-900">
                        <div>{entry.clientName}</div>
                        {entry.clientPhone && (
                          <div className="text-[10px] text-stone-400 font-mono">{entry.clientPhone}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            entry.type === 'Service'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-stone-900">{entry.itemName}</div>
                        {entry.notes && (
                          <div className="text-[10px] text-stone-500 italic truncate max-w-xs">{entry.notes}</div>
                        )}
                      </td>
                      <td className="p-3 text-stone-700 font-medium">{entry.staffName}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-stone-700">
                          <CreditCard className="w-3 h-3 text-emerald-800" />
                          {entry.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-950 tabular-nums">
                        KSh {entry.amountKSh.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setReceiptSale(entry)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 rounded-lg text-[11px] font-semibold border border-stone-200 transition-colors cursor-pointer"
                          title="Generate official receipt & send on WhatsApp"
                        >
                          <Receipt className="w-3 h-3 text-emerald-800" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES BOOK */}
      {activeTab === 'expenses' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Bareglow Salon Expenses Book</h2>
              <p className="text-xs text-stone-500">Record all rent, utility tokens, raw products, and staff refreshments.</p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Paid To</th>
                  <th className="p-3">Method &amp; Ref</th>
                  <th className="p-3 text-right">Amount (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50/50">
                    <td className="p-3 text-stone-600 font-mono">{exp.date}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-stone-900">{exp.description}</td>
                    <td className="p-3 text-stone-700">{exp.paidTo}</td>
                    <td className="p-3 font-mono text-[11px] text-stone-500">
                      {exp.paymentMethod} {exp.receiptRef ? `· ${exp.receiptRef}` : ''}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-red-700 tabular-nums">
                      - KSh {exp.amountKSh.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECORD NEW SALE / POS */}
      {activeTab === 'pos' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Front Desk &amp; Cashier POS Register</h2>
              <p className="text-xs text-stone-500">
                Operated by Receptionist — records client payment (Cash/M-Pesa Till 9597237) and assigns the attending stylist for commission tracking.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg text-[11px] font-semibold border border-stone-200 shrink-0">
              <User className="w-3.5 h-3.5 text-emerald-800" />
              Receptionist Desk
            </span>
          </div>

          <form onSubmit={handleSaleSubmit} className="space-y-4 text-xs">
            {/* Sale Type Switch */}
            <div className="flex p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSaleType('Service');
                  setSelectedItemName(BAREGLOW_SERVICES[0].name);
                  setSaleAmount(BAREGLOW_SERVICES[0].priceKSh);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  saleType === 'Service' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Salon Service (105 Available)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaleType('Product Retail');
                  setSelectedItemName(inventory[0].name);
                  setSaleAmount(inventory[0].priceKSh);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  saleType === 'Product Retail' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Product Retail (80 Items)
              </button>
            </div>

            {/* Automatic Date & Editable Time Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-gradient-to-r from-stone-50 to-emerald-50/40 border border-stone-200 rounded-xl">
              {/* Automatic Date */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-800 font-bold flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Sale Date (Automatic)</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                    Today Auto-Set
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setSaleDate(getTodayDateString())}
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-stone-700 hover:text-emerald-900 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
                    title="Reset to today's date"
                  >
                    Today
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Automatic current date. Change if recording a previous appointment.
                </p>
              </div>

              {/* Editable Time */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-800 font-bold flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Sale Time (Editable)</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100/70 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    {formatTimeTo12Hour(saleTime)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="time"
                    required
                    value={saleTime}
                    onChange={(e) => setSaleTime(e.target.value)}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white font-mono text-xs font-semibold focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setSaleTime(getCurrentTimeInput())}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                    title="Set to exact current time"
                  >
                    <Clock className="w-3 h-3 text-emerald-700" />
                    Now
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Pre-filled with current time. You can adjust hours/minutes anytime.
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joy Wambui"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Client Phone (For WhatsApp Receipt)</label>
                <input
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            {/* Item Dropdown */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {saleType === 'Service' ? 'Select Salon Service' : 'Select Product (Auto-Stock Update)'} *
              </label>
              <select
                value={selectedItemName}
                onChange={(e) => handleItemChange(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
              >
                {saleType === 'Service'
                  ? BAREGLOW_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.department}) - KSh {s.priceKSh.toLocaleString()}
                      </option>
                    ))
                  : inventory.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.size}) - KSh {p.priceKSh.toLocaleString()} [Stock: {p.stockQuantity}]
                      </option>
                    ))}
              </select>
            </div>

            {/* Staff Assigned & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Stylist / Specialist Who Provided Service *
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
                >
                  {staffList
                    .filter((st) => st.status === 'active')
                    .map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.position})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-stone-500 mt-1">
                  Receptionist records attending staff member for commission tracking.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Payment Method *</label>
                <select
                  value={salePaymentMethod}
                  onChange={(e) => setSalePaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white font-medium"
                >
                  <option value="M-Pesa">M-Pesa (Buy Goods Till 9597237)</option>
                  <option value="Cash">Cash at Reception</option>
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Amount to Bill (KSh) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">KSh</span>
                <input
                  type="number"
                  required
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 text-sm"
                />
              </div>
            </div>

            {/* Notes / Special Requests */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Treatment Notes / Hair Formula (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Medium length knotless, used honey blonde shade 27"
                value={saleNotes}
                onChange={(e) => setSaleNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('sales')}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Record &amp; Generate E-Receipt (KSh {saleAmount.toLocaleString()})</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900">Record Salon Operating Expense</h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Expense Category *</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
                >
                  <option value="Rent">Premise Rent (Nyali Petrocity)</option>
                  <option value="Utilities & Power">KPLC Electricity Tokens / Water</option>
                  <option value="Salon Supplies & Products">Salon Raw Products & Towels</option>
                  <option value="Staff Welfare & Tea">Staff Tea, Milk & Snacks</option>
                  <option value="Repairs & Maintenance">Equipment Repairs & Servicing</option>
                  <option value="Marketing">Social Media Promotion / Adverts</option>
                  <option value="Other">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milk & tea bags for staff, or KPLC electricity token"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Amount (KSh) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">KSh</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full pl-12 pr-4 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Payment Source *</label>
                <select
                  value={expenseMethod}
                  onChange={(e) => setExpenseMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
                >
                  <option value="Cash">Cash (Taken from front desk drawer)</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <p className="text-[10px] text-stone-500 mt-1">
                  Cash expenses are automatically subtracted from drawer balance in evening till reconciliation.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Paid To (Vendor / Recipient)</label>
                <input
                  type="text"
                  placeholder="e.g. Naivas Nyali, KPLC"
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 cursor-pointer"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instant Client E-Receipt Modal */}
      {receiptSale && (
        <ClientReceiptModal
          sale={receiptSale}
          onClose={() => setReceiptSale(null)}
        />
      )}

      {/* End-of-Day Till Reconciliation & Cash-Up Modal */}
      {showTillModal && (
        <TillReconciliationModal
          sales={sales}
          expenses={expenses}
          staffList={staffList}
          handovers={handovers}
          onSaveHandover={(handover) => {
            if (onSaveHandover) onSaveHandover(handover);
          }}
          onClose={() => setShowTillModal(false)}
        />
      )}
    </div>
  );
}
