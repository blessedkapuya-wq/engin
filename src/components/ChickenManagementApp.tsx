import React, { useState, useMemo } from 'react';
import {
  PoultryBatch,
  VaccinationRecord,
  FeedRecord,
  MortalityRecord,
  PoultryExpense,
  PoultrySale,
  FarmFinancialSummary,
  PoultryExpenseCategory,
  ChickDeliveryStatus,
  SalePaymentStatus
} from '../types/poultry';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  AlertTriangle,
  DollarSign,
  Syringe,
  Wheat,
  Skull,
  ShoppingBag,
  Layers,
  Printer,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Check,
  X,
  Package,
  Pill,
  Sparkles,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bird,
  Download,
  Shield,
  Upload
} from 'lucide-react';

interface ChickenManagementAppProps {
  batches: PoultryBatch[];
  vaccinations: VaccinationRecord[];
  feeds: FeedRecord[];
  mortalities: MortalityRecord[];
  expenses: PoultryExpense[];
  sales: PoultrySale[];
  onAddBatch: (batch: PoultryBatch) => void;
  onUpdateBatch: (batches: PoultryBatch[]) => void;
  onAddVaccination: (vac: VaccinationRecord) => void;
  onUpdateVaccination: (vacs: VaccinationRecord[]) => void;
  onAddFeed: (feed: FeedRecord) => void;
  onAddMortality: (mort: MortalityRecord) => void;
  onAddExpense: (exp: PoultryExpense) => void;
  onAddSale: (sale: PoultrySale) => void;
  onUpdateSale?: (sales: PoultrySale[]) => void;
  onResetToTanzaniaData?: () => void;
  cloudConnected?: boolean;
  onManualSyncToCloud?: () => Promise<{ success: boolean; count: number }>;
  onRestorePoultryBackup?: (data: any) => void;
}

export default function ChickenManagementApp({
  batches,
  vaccinations,
  feeds,
  mortalities,
  expenses,
  sales,
  onAddBatch,
  onUpdateBatch,
  onAddVaccination,
  onUpdateVaccination,
  onAddFeed,
  onAddMortality,
  onAddExpense,
  onAddSale,
  onUpdateSale,
  onResetToTanzaniaData,
  cloudConnected = true,
  onManualSyncToCloud,
  onRestorePoultryBackup
}: ChickenManagementAppProps) {
  // Navigation Tabs inside Chicken Management
  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'vaccines' | 'feed' | 'mortality' | 'expenses' | 'sales' | 'pnl'>('overview');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Automatic calculation & Monthly P&L states
  const [selectedPnlMonth, setSelectedPnlMonth] = useState<string>('all');
  const [selectedExpMonth, setSelectedExpMonth] = useState<string>('all');
  const [lastSaleFeedback, setLastSaleFeedback] = useState<{
    id: string;
    batchName: string;
    qty: number;
    saleType: string;
    unitPrice: number;
    totalRevenue: number;
    newNetProfit: number;
    isProfit: boolean;
    timestamp: string;
  } | null>(null);

  // Modals state
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showMortalityModal, setShowMortalityModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Filter states for Batches and Sales
  const [batchDeliveryFilter, setBatchDeliveryFilter] = useState<'all' | 'delivered' | 'ordered'>('all');
  const [salePaymentFilter, setSalePaymentFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  // Modal state for recording payment on unpaid deliveries
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingSale, setPayingSale] = useState<PoultrySale | null>(null);
  const [payAmountTZS, setPayAmountTZS] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PoultrySale['paymentMethod']>('Vodacom M-Pesa');
  const [payRef, setPayRef] = useState('');

  // Form states for New Batch (Broilers in Tanzania & Interchick Orders)
  const [newBatchName, setNewBatchName] = useState('');
  const [newBreed, setNewBreed] = useState<PoultryBatch['breed']>('Cobb 500 Broiler');
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newQuantity, setNewQuantity] = useState<number>(500);
  const [newPricePerBirdTZS, setNewPricePerBirdTZS] = useState<number>(2200); // 2,200 TZS per day-old broiler chick
  const [newSupplier, setNewSupplier] = useState('Interchick Tanzania');
  const [newSourceType, setNewSourceType] = useState<PoultryBatch['sourceType']>('Day-old chicks');
  const [newStage, setNewStage] = useState<PoultryBatch['stage']>('Day 1-7 (Brooding & Starter)');
  const [newTargetPriceTZS, setNewTargetPriceTZS] = useState<number>(11000); // 11,000 TZS target selling price per mature broiler
  const [newTargetWeightKg, setNewTargetWeightKg] = useState<number>(2.1);
  const [newBatchNotes, setNewBatchNotes] = useState('');
  // New batch delivery status (Ordered & Paid Interchick vs Already Delivered to Farm)
  const [newDeliveryStatus, setNewDeliveryStatus] = useState<ChickDeliveryStatus>('Delivered to Farm');
  const [newHatcheryOrderRef, setNewHatcheryOrderRef] = useState('');
  const [newExpectedDeliveryDate, setNewExpectedDeliveryDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Form states for Vaccine (Broiler 35-day cycle)
  const [vacBatchId, setVacBatchId] = useState(batches[0]?.id || '');
  const [vacName, setVacName] = useState('Gumboro (IBD) Dose ya Kwanza (Siku ya 8)');
  const [vacTargetDate, setVacTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [vacRoute, setVacRoute] = useState<VaccinationRecord['route']>('Drinking Water');
  const [vacCostTZS, setVacCostTZS] = useState<number>(22000);
  const [vacAdminBy, setVacAdminBy] = useState('Vet John (Mtaalamu wa Mifugo)');
  const [vacNotes, setVacNotes] = useState('');

  // Form states for Feed (Broiler Starter & Finisher)
  const [feedBatchId, setFeedBatchId] = useState(batches[0]?.id || '');
  const [feedType, setFeedType] = useState<FeedRecord['feedType']>('Broiler Starter');
  const [feedDate, setFeedDate] = useState(new Date().toISOString().split('T')[0]);
  const [feedKg, setFeedKg] = useState<number>(150);
  const [feedCostPerKgTZS, setFeedCostPerKgTZS] = useState<number>(1550);
  const [feedBrand, setFeedBrand] = useState('Interchick Feeds');
  const [feedNotes, setFeedNotes] = useState('');

  // Form states for Mortality
  const [mortBatchId, setMortBatchId] = useState(batches[0]?.id || '');
  const [mortDate, setMortDate] = useState(new Date().toISOString().split('T')[0]);
  const [mortCount, setMortCount] = useState<number>(2);
  const [mortCause, setMortCause] = useState<MortalityRecord['suspectedCause']>('Cold / Brooding Chilling');
  const [mortAction, setMortAction] = useState('Kuweka electrolytes na vitamini kwenye maji ya kunywa');
  const [mortNotes, setMortNotes] = useState('');

  // Form states for Other Expense (PUMBA, MEDECINE, Bedding, Labor, etc.)
  const [expBatchId, setExpBatchId] = useState<string>('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expCategory, setExpCategory] = useState<PoultryExpenseCategory>('Pumba (Pumba ya Mahindi / Mpunga)');
  const [expDesc, setExpDesc] = useState('');
  const [expAmountTZS, setExpAmountTZS] = useState<number>(36000);
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expMethod, setExpMethod] = useState<PoultryExpense['paymentMethod']>('Vodacom M-Pesa');
  const [expReceipt, setExpReceipt] = useState('');

  // Form states for Broiler Chicken Sales (Includes Unpaid Deliveries tracking)
  const [saleBatchId, setSaleBatchId] = useState(batches[0]?.id || '');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleType, setSaleType] = useState<PoultrySale['saleType']>('Live Broilers (Kuku Hai)');
  const [saleQty, setSaleQty] = useState<number>(30);
  const [saleUnitPriceTZS, setSaleUnitPriceTZS] = useState<number>(11000);
  const [saleBuyer, setSaleBuyer] = useState('');
  const [salePhone, setSalePhone] = useState('0757895896');
  const [saleMethod, setSaleMethod] = useState<PoultrySale['paymentMethod']>('Vodacom M-Pesa');
  const [salePaymentRef, setSalePaymentRef] = useState('');
  const [saleNotes, setSaleNotes] = useState('');
  // Unpaid delivery states (Kuku waliopelekwa lakini hawajalipwa)
  const [saleDeliveryStatus, setSaleDeliveryStatus] = useState<'Delivered' | 'Pending Delivery'>('Delivered');
  const [salePaymentStatus, setSalePaymentStatus] = useState<SalePaymentStatus>('Paid');
  const [saleAmountPaidTZS, setSaleAmountPaidTZS] = useState<number>(330000);
  const [saleDueDate, setSaleDueDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Format Helper for Tanzanian Shillings
  const formatTZS = (num: number): string => {
    return `TSh ${(Number(num) || 0).toLocaleString()}`;
  };

  // Helper to extract numeric money values from either TZS or legacy KSh fields
  const getBatchCost = (b: PoultryBatch): number => {
    return Number(b.totalPurchaseCostTZS ?? b.totalPurchaseCostKSh ?? 0);
  };
  const getBatchPricePerBird = (b: PoultryBatch): number => {
    return Number(b.purchasePricePerBirdTZS ?? b.purchasePricePerBirdKSh ?? 0);
  };
  const getBatchTargetPrice = (b: PoultryBatch): number => {
    return Number(b.targetSellingPricePerBirdTZS ?? b.targetSellingPricePerBirdKSh ?? 0);
  };

  const getFeedCost = (f: FeedRecord): number => {
    return Number(f.totalCostTZS ?? f.totalCostKSh ?? 0);
  };
  const getFeedCostPerKg = (f: FeedRecord): number => {
    return Number(f.costPerKgTZS ?? f.costPerKgKSh ?? 0);
  };

  const getVacCost = (v: VaccinationRecord): number => {
    return Number(v.costTZS ?? v.costKSh ?? 0);
  };

  const getExpAmount = (e: PoultryExpense): number => {
    return Number(e.amountTZS ?? e.amountKSh ?? 0);
  };

  const getSaleRevenue = (s: PoultrySale): number => {
    return Number(s.totalRevenueTZS ?? s.totalRevenueKSh ?? 0);
  };
  const getSaleUnitPrice = (s: PoultrySale): number => {
    return Number(s.sellingPricePerUnitTZS ?? s.sellingPricePerUnitKSh ?? 0);
  };

  // Quick Open Expense Modal with preselected category
  const openExpenseForCategory = (cat: PoultryExpenseCategory, defaultDesc: string, defaultAmount: number) => {
    setExpCategory(cat);
    setExpDesc(defaultDesc);
    setExpAmountTZS(defaultAmount);
    setShowExpenseModal(true);
  };

  // Helper to calculate Broiler flock age in days
  const getBroilerAgeDays = (entryDate: string): number => {
    try {
      const diffTime = Math.max(0, Date.now() - new Date(entryDate).getTime());
      return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 1;
    }
  };

  // Cloud sync & Backup state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // 1-Click WhatsApp Debt Reminder for Delivered Unpaid Broilers
  const generateWhatsAppDebtReminder = (sale: PoultrySale): string => {
    const buyer = sale.buyerName || 'Mteja';
    const birds = sale.quantitySold;
    const due = (sale.amountDueTZS !== undefined ? sale.amountDueTZS : Math.max(0, getSaleRevenue(sale) - (sale.amountPaidTZS || 0))).toLocaleString();
    const date = sale.deliveredDate || sale.date;
    const dueDate = sale.paymentDueDate ? `Tarehe ya ahadi ya kulipa: ${sale.paymentDueDate}.\n` : '';
    const message = `Habari ${buyer},\n\nTunakusalimu kutoka *Blessed Poultry Farm* (0757 895 896).\n\nTunakukumbusha kuhusu mzigo wa *kuku wa nyama (Broilers) ${birds}* uliopokea tarehe ${date}.\n\nKiasi kinachodaiwa ni: *TSh ${due}*.\n${dueDate}Tafadhali fanya malipo kupitia Lipa Namba M-Pesa / Tigo Pesa au Wasiliana nasi.\n\nAsante sana kwa ushirikiano wako! 🐔`;

    let phone = (sale.buyerPhone || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '255' + phone.substring(1);
    if (!phone.startsWith('255') && phone.length === 9) phone = '255' + phone;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // 1-Click WhatsApp Sales Receipt
  const generateWhatsAppSaleReceipt = (sale: PoultrySale): string => {
    const buyer = sale.buyerName || 'Mteja';
    const birds = sale.quantitySold;
    const total = getSaleRevenue(sale).toLocaleString();
    const paid = (sale.amountPaidTZS !== undefined ? sale.amountPaidTZS : getSaleRevenue(sale)).toLocaleString();
    const due = (sale.amountDueTZS || 0).toLocaleString();
    const message = `🧾 *RISITI YA MAUZO - BLESSED POULTRY FARM*\nSimu: 0757 895 896 / blessedkapuya@gmail.com\nDar es Salaam & Pwani, Tanzania\n--------------------------------\nTarehe: *${sale.date}*\nMteja: *${buyer}*\nAina: *${sale.saleType}*\nIdadi ya Kuku: *${birds}*\nBei kwa Kuku: *TSh ${getSaleUnitPrice(sale).toLocaleString()}*\nJumla Kuu: *TSh ${total}*\nKiasi Kilicholipwa: *TSh ${paid}*\nBaki Inayodaiwa: *TSh ${due}*\n--------------------------------\nAsante sana kwa kufanya biashara na Blessed Poultry Farm! Karibu tena.`;

    let phone = (sale.buyerPhone || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '255' + phone.substring(1);
    if (!phone.startsWith('255') && phone.length === 9) phone = '255' + phone;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // 1-Click Export Farm Backup (.json)
  const handleExportFarmBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      farmName: 'Blessed Poultry Farm Tanzania',
      currency: 'TZS',
      batches,
      sales,
      expenses,
      feeds,
      vaccinations,
      mortalities
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blessed_poultry_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSyncToast('Backup ya shamba (.json) imepakuliwa kikamilifu!');
  };

  // 1-Click Restore Farm Backup (.json)
  const handleImportFarmBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (onRestorePoultryBackup) {
          onRestorePoultryBackup(parsed);
        } else {
          if (parsed.batches) onUpdateBatch(parsed.batches);
          if (parsed.vaccinations) onUpdateVaccination(parsed.vaccinations);
        }
        setSyncToast('Rekodi zote za shamba zimepakiwa na kurejeshwa kikamilifu!');
      } catch (err) {
        alert('Faili la backup si sahihi. Tafadhali pakia faili halali la .json.');
      }
    };
    reader.readAsText(file);
  };

  // Trigger manual cloud sync
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      if (onManualSyncToCloud) {
        const res = await onManualSyncToCloud();
        setSyncToast(`Wingu limesawazishwa! Rekodi ${res.count} zimehifadhiwa salama Google Cloud Firestore.`);
      } else {
        setSyncToast('Wingu limeunganishwa na kusawazishwa!');
      }
    } catch (err) {
      setSyncToast('Imeshindwa kusawazisha na wingu kwa sasa. Data imehifadhiwa ndani ya kifaa.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 6000);
    }
  };

  // COMPREHENSIVE FINANCIAL & INVENTORY CALCULATIONS (TANZANIA TZS)
  const financialSummary = useMemo<FarmFinancialSummary>(() => {
    // Separate delivered batches (on farm) from batches ordered/paid at hatcheries (e.g. Interchick)
    const deliveredBatches = batches.filter((b) => b.deliveryStatus !== 'Ordered & Paid (Awaiting Delivery)');
    const pendingChickBatches = batches.filter((b) => b.deliveryStatus === 'Ordered & Paid (Awaiting Delivery)');

    const totalBirdsPurchased = batches.reduce((sum, b) => sum + (Number(b.initialQuantity) || 0), 0);
    const farmBirdsPurchased = deliveredBatches.reduce((sum, b) => sum + (Number(b.initialQuantity) || 0), 0);
    const totalPurchaseExpenseTZS = batches.reduce((sum, b) => sum + getBatchCost(b), 0);
    const totalMortality = mortalities.reduce((sum, m) => sum + (Number(m.deathCount) || 0), 0);
    
    // Live broilers sold (Live or dressed meat)
    const liveBirdsSold = sales
      .filter((s) => 
        s.saleType === 'Live Broilers (Kuku Hai)' || 
        s.saleType === 'Dressed / Slaughtered Meat (Nyama)' || 
        s.saleType === 'Live Birds' || 
        s.saleType === 'Dressed / Slaughtered Meat' ||
        s.saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)'
      )
      .reduce((sum, s) => sum + (Number(s.quantitySold) || 0), 0);

    // Live birds currently on farm (only from batches physically arrived at the farm)
    const currentLiveBirds = Math.max(0, farmBirdsPurchased - totalMortality - liveBirdsSold);
    const mortalityRatePercent = farmBirdsPurchased > 0 ? (totalMortality / farmBirdsPurchased) * 100 : 0;

    const totalFeedExpenseTZS = feeds.reduce((sum, f) => sum + getFeedCost(f), 0);
    const totalMedicationExpenseTZS = vaccinations.reduce((sum, v) => sum + getVacCost(v), 0);

    // Specific breakdowns for user's requested "PUMBA" and "MEDECINE"
    const totalPumbaExpenseTZS = expenses
      .filter((e) => e.category === 'Pumba (Pumba ya Mahindi / Mpunga)')
      .reduce((sum, e) => sum + getExpAmount(e), 0);

    const totalMedicineExpenseTZS = expenses
      .filter((e) => e.category === 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)')
      .reduce((sum, e) => sum + getExpAmount(e), 0);

    const totalOtherExpensesTZS = expenses.reduce((sum, e) => sum + getExpAmount(e), 0);

    const grandTotalExpensesTZS =
      totalPurchaseExpenseTZS +
      totalFeedExpenseTZS +
      totalMedicationExpenseTZS +
      totalOtherExpensesTZS;

    const totalRevenueTZS = sales.reduce((sum, s) => sum + getSaleRevenue(s), 0);

    // Cash collected vs Unpaid Customer Receivables (Kuku waliopelekwa bila malipo / Madeni)
    const totalCashCollectedTZS = sales.reduce((sum, s) => {
      if (s.amountPaidTZS !== undefined) return sum + (Number(s.amountPaidTZS) || 0);
      if (s.paymentStatus === 'Unpaid / Pending Payment') return sum;
      return sum + getSaleRevenue(s);
    }, 0);

    const totalUnpaidReceivablesTZS = sales.reduce((sum, s) => {
      if (s.amountDueTZS !== undefined) return sum + (Number(s.amountDueTZS) || 0);
      if (s.paymentStatus === 'Unpaid / Pending Payment') return sum + getSaleRevenue(s);
      return sum;
    }, 0);

    const unpaidBirdsCount = sales
      .filter((s) => s.paymentStatus === 'Unpaid / Pending Payment' || s.paymentStatus === 'Partial Payment')
      .reduce((sum, s) => sum + (Number(s.quantitySold) || 0), 0);

    // Hatchery orders (Vifaranga vilivyoagizwa na kulipwa Interchick vinavyosubiriwa kufika shambani)
    const pendingChickOrdersCount = pendingChickBatches.reduce((sum, b) => sum + (Number(b.initialQuantity) || 0), 0);
    const pendingChickOrdersCostTZS = pendingChickBatches.reduce((sum, b) => sum + getBatchCost(b), 0);

    const netProfitLossTZS = totalRevenueTZS - grandTotalExpensesTZS;
    const isProfit = netProfitLossTZS >= 0;
    const averageProfitPerBirdSoldTZS = liveBirdsSold > 0 ? netProfitLossTZS / liveBirdsSold : 0;

    return {
      totalBirdsPurchased,
      totalMortality,
      currentLiveBirds,
      mortalityRatePercent,
      totalBirdsSold: liveBirdsSold,
      totalPurchaseExpenseTZS,
      totalFeedExpenseTZS,
      totalMedicationExpenseTZS,
      totalPumbaExpenseTZS,
      totalMedicineExpenseTZS,
      totalOtherExpensesTZS,
      grandTotalExpensesTZS,
      totalRevenueTZS,
      totalCashCollectedTZS,
      totalUnpaidReceivablesTZS,
      unpaidBirdsCount,
      pendingChickOrdersCount,
      pendingChickOrdersCostTZS,
      netProfitLossTZS,
      isProfit,
      averageProfitPerBirdSoldTZS
    };
  }, [batches, mortalities, feeds, vaccinations, expenses, sales]);

  // Swahili Month Dictionary for Tanzania Calendar
  const SWAHILI_MONTHS: Record<string, string> = {
    '01': 'Januari',
    '02': 'Februari',
    '03': 'Machi',
    '04': 'Aprili',
    '05': 'Mei',
    '06': 'Juni',
    '07': 'Julai',
    '08': 'Agosti',
    '09': 'Septemba',
    '10': 'Oktoba',
    '11': 'Novemba',
    '12': 'Desemba'
  };

  const getMonthKey = (dateStr?: string): string => {
    if (!dateStr || dateStr.length < 7) return '';
    return dateStr.substring(0, 7);
  };

  const formatMonthLabel = (monthKey: string): string => {
    if (!monthKey || monthKey.length < 7) return monthKey;
    const [year, month] = monthKey.split('-');
    const swName = SWAHILI_MONTHS[month] || month;
    return `${swName} ${year}`;
  };

  // Discover all months across transactions
  const allAvailableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    sales.forEach((s) => s.date && monthSet.add(getMonthKey(s.date)));
    expenses.forEach((e) => e.date && monthSet.add(getMonthKey(e.date)));
    feeds.forEach((f) => f.date && monthSet.add(getMonthKey(f.date)));
    vaccinations.forEach((v) => {
      const d = v.administeredDate || v.targetDate;
      if (d) monthSet.add(getMonthKey(d));
    });
    batches.forEach((b) => b.entryDate && monthSet.add(getMonthKey(b.entryDate)));
    return Array.from(monthSet).filter(Boolean).sort().reverse();
  }, [sales, expenses, feeds, vaccinations, batches]);

  // AUTOMATED MONTH-BY-MONTH PROFIT & EXPENSES BREAKDOWN
  const monthlyFinancialBreakdown = useMemo(() => {
    return allAvailableMonths.map((mKey) => {
      const mSales = sales.filter((s) => getMonthKey(s.date) === mKey);
      const mExpenses = expenses.filter((e) => getMonthKey(e.date) === mKey);
      const mFeeds = feeds.filter((f) => getMonthKey(f.date) === mKey);
      const mVaccines = vaccinations.filter((v) => getMonthKey(v.administeredDate || v.targetDate) === mKey);
      const mBatches = batches.filter((b) => getMonthKey(b.entryDate) === mKey);

      const mRevenue = mSales.reduce((sum, s) => sum + getSaleRevenue(s), 0);
      const mBirdsSold = mSales
        .filter((s) => 
          s.saleType === 'Live Broilers (Kuku Hai)' || 
          s.saleType === 'Dressed / Slaughtered Meat (Nyama)' || 
          s.saleType === 'Live Birds' || 
          s.saleType === 'Dressed / Slaughtered Meat' ||
          s.saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)'
        )
        .reduce((sum, s) => sum + (Number(s.quantitySold) || 0), 0);

      const mChickPurchaseCost = mBatches.reduce((sum, b) => sum + getBatchCost(b), 0);
      const mChicksCount = mBatches.reduce((sum, b) => sum + (Number(b.initialQuantity) || 0), 0);

      const mFeedCost = mFeeds.reduce((sum, f) => sum + getFeedCost(f), 0);
      const mFeedKg = mFeeds.reduce((sum, f) => sum + (Number(f.quantityKg) || 0), 0);

      const mVaccineCost = mVaccines.reduce((sum, v) => sum + getVacCost(v), 0);

      // Dedicated Pumba and Medecine monthly totals
      const mPumbaCost = mExpenses
        .filter((e) => e.category === 'Pumba (Pumba ya Mahindi / Mpunga)')
        .reduce((sum, e) => sum + getExpAmount(e), 0);

      const mMedicineCost = mExpenses
        .filter((e) => e.category === 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)')
        .reduce((sum, e) => sum + getExpAmount(e), 0);

      const mOtherOverheadsCost = mExpenses
        .filter(
          (e) =>
            e.category !== 'Pumba (Pumba ya Mahindi / Mpunga)' &&
            e.category !== 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)'
        )
        .reduce((sum, e) => sum + getExpAmount(e), 0);

      const mTotalExpenses =
        mChickPurchaseCost +
        mFeedCost +
        mVaccineCost +
        mPumbaCost +
        mMedicineCost +
        mOtherOverheadsCost;

      const mNetProfit = mRevenue - mTotalExpenses;
      const mIsProfit = mNetProfit >= 0;
      const mProfitMarginPercent = mRevenue > 0 ? (mNetProfit / mRevenue) * 100 : 0;

      return {
        monthKey: mKey,
        monthName: formatMonthLabel(mKey),
        salesRevenue: mRevenue,
        birdsSold: mBirdsSold,
        chickCost: mChickPurchaseCost,
        chicksCount: mChicksCount,
        feedCost: mFeedCost,
        feedKg: mFeedKg,
        vaccineCost: mVaccineCost,
        pumbaCost: mPumbaCost,
        medicineCost: mMedicineCost,
        otherOverheadsCost: mOtherOverheadsCost,
        totalExpenses: mTotalExpenses,
        netProfitLoss: mNetProfit,
        isProfit: mIsProfit,
        profitMarginPercent: mProfitMarginPercent
      };
    });
  }, [allAvailableMonths, sales, expenses, feeds, vaccinations, batches]);

  // Active P&L display based on selected month filter
  const activeMonthSummary = useMemo(() => {
    if (selectedPnlMonth === 'all') {
      return {
        label: 'Jumla ya Miezi Yote (All-Time Farm Statement)',
        isAllTime: true,
        revenue: financialSummary.totalRevenueTZS,
        birdsSold: financialSummary.totalBirdsSold,
        chickCost: financialSummary.totalPurchaseExpenseTZS,
        feedCost: financialSummary.totalFeedExpenseTZS,
        pumbaCost: financialSummary.totalPumbaExpenseTZS,
        medicineCost: financialSummary.totalMedicineExpenseTZS,
        vaccineCost: financialSummary.totalMedicationExpenseTZS,
        otherCost: financialSummary.totalOtherExpensesTZS - financialSummary.totalPumbaExpenseTZS - financialSummary.totalMedicineExpenseTZS,
        totalExpenses: financialSummary.grandTotalExpensesTZS,
        netProfit: financialSummary.netProfitLossTZS,
        isProfit: financialSummary.isProfit
      };
    }
    const found = monthlyFinancialBreakdown.find((m) => m.monthKey === selectedPnlMonth);
    if (!found) {
      return {
        label: formatMonthLabel(selectedPnlMonth),
        isAllTime: false,
        revenue: 0,
        birdsSold: 0,
        chickCost: 0,
        feedCost: 0,
        pumbaCost: 0,
        medicineCost: 0,
        vaccineCost: 0,
        otherCost: 0,
        totalExpenses: 0,
        netProfit: 0,
        isProfit: true
      };
    }
    return {
      label: `Mwezi wa ${found.monthName}`,
      isAllTime: false,
      revenue: found.salesRevenue,
      birdsSold: found.birdsSold,
      chickCost: found.chickCost,
      feedCost: found.feedCost,
      pumbaCost: found.pumbaCost,
      medicineCost: found.medicineCost,
      vaccineCost: found.vaccineCost,
      otherCost: found.otherOverheadsCost,
      totalExpenses: found.totalExpenses,
      netProfit: found.netProfitLoss,
      isProfit: found.isProfit
    };
  }, [selectedPnlMonth, financialSummary, monthlyFinancialBreakdown]);

  // Per-Batch Calculations
  const batchAnalytics = useMemo(() => {
    return batches.map((b) => {
      const isAwaitingDelivery = b.deliveryStatus === 'Ordered & Paid (Awaiting Delivery)';
      const bMortality = mortalities
        .filter((m) => m.batchId === b.id)
        .reduce((sum, m) => sum + (Number(m.deathCount) || 0), 0);

      const bSales = sales.filter((s) => s.batchId === b.id);
      const bLiveSold = bSales
        .filter((s) => 
          s.saleType === 'Live Broilers (Kuku Hai)' || 
          s.saleType === 'Dressed / Slaughtered Meat (Nyama)' || 
          s.saleType === 'Live Birds' || 
          s.saleType === 'Dressed / Slaughtered Meat' ||
          s.saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)'
        )
        .reduce((sum, s) => sum + (Number(s.quantitySold) || 0), 0);
      const bRevenue = bSales.reduce((sum, s) => sum + getSaleRevenue(s), 0);

      const bFeedCost = feeds
        .filter((f) => f.batchId === b.id)
        .reduce((sum, f) => sum + getFeedCost(f), 0);

      const bMedCost = vaccinations
        .filter((v) => v.batchId === b.id)
        .reduce((sum, v) => sum + getVacCost(v), 0);

      const bOtherExp = expenses
        .filter((e) => e.batchId === b.id)
        .reduce((sum, e) => sum + getExpAmount(e), 0);

      const batchCost = getBatchCost(b);
      const targetSellPrice = getBatchTargetPrice(b) || 11000;
      const totalBatchCost = batchCost + bFeedCost + bMedCost + bOtherExp;
      const netBatchProfit = bRevenue - totalBatchCost;
      const liveBirdsRemaining = isAwaitingDelivery ? 0 : Math.max(0, b.initialQuantity - bMortality - bLiveSold);
      const mortalityRate = b.initialQuantity > 0 && !isAwaitingDelivery ? (bMortality / b.initialQuantity) * 100 : 0;

      // Projected potential revenue if remaining birds sold at target price
      const projectedRemainingRevenue = (isAwaitingDelivery ? b.initialQuantity : liveBirdsRemaining) * targetSellPrice;
      const projectedTotalRevenue = bRevenue + projectedRemainingRevenue;
      const projectedNetProfit = projectedTotalRevenue - totalBatchCost;

      // Broiler Age & 35-Day Commercial Harvest Countdown
      const entryTime = b.entryDate ? new Date(b.entryDate).getTime() : Date.now();
      const ageDays = isAwaitingDelivery ? 0 : Math.max(1, Math.floor((Date.now() - entryTime) / (1000 * 60 * 60 * 24)) + 1);
      const cycleTargetDays = 35; // Standard Cobb 500 / Ross 308 broiler market ready day
      const daysUntilHarvest = Math.max(0, cycleTargetDays - ageDays);
      const harvestProgressPercent = isAwaitingDelivery ? 0 : Math.min(100, Math.round((ageDays / cycleTargetDays) * 100));

      // Unit Economics: Cost to Produce 1 Broiler & Profit Margin
      const effectiveBirds = Math.max(1, isAwaitingDelivery ? b.initialQuantity : (liveBirdsRemaining + bLiveSold));
      const costPerBird = Math.round(totalBatchCost / effectiveBirds);
      const profitPerBird = targetSellPrice - costPerBird;

      return {
        ...b,
        isAwaitingDelivery,
        mortalityCount: bMortality,
        liveSold: bLiveSold,
        liveRemaining: liveBirdsRemaining,
        mortalityRate,
        feedCost: bFeedCost,
        medicationCost: bMedCost,
        otherCost: bOtherExp,
        totalCost: totalBatchCost,
        realizedRevenue: bRevenue,
        realizedNetProfit: netBatchProfit,
        projectedNetProfit,
        unitPrice: getBatchPricePerBird(b),
        targetPrice: targetSellPrice,
        ageDays,
        cycleTargetDays,
        daysUntilHarvest,
        harvestProgressPercent,
        costPerBird,
        profitPerBird
      };
    });
  }, [batches, mortalities, sales, feeds, vaccinations, expenses]);

  // Handle Submit New Batch (Broilers or Interchick Orders)
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(newQuantity) || 1;
    const price = Number(newPricePerBirdTZS) || 2200;
    const targetPrice = Number(newTargetPriceTZS) || 11000;
    const isOrderedAwaiting = newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)';

    const newBatch: PoultryBatch = {
      id: `batch-tz-${Date.now()}`,
      batchName: newBatchName.trim() || `Batch #${batches.length + 1} - ${newBreed}`,
      breed: newBreed,
      entryDate: isOrderedAwaiting ? newExpectedDeliveryDate : newEntryDate,
      orderDate: isOrderedAwaiting ? newEntryDate : undefined,
      expectedDeliveryDate: isOrderedAwaiting ? newExpectedDeliveryDate : undefined,
      deliveryStatus: newDeliveryStatus,
      isSupplierPaid: true,
      hatcheryOrderRef: newHatcheryOrderRef.trim() || (isOrderedAwaiting ? `INTERCHICK-ORD-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      initialQuantity: qty,
      currentQuantity: isOrderedAwaiting ? 0 : qty, // 0 inside farm brooder if still awaiting delivery
      purchasePricePerBirdTZS: price,
      totalPurchaseCostTZS: qty * price,
      supplier: newSupplier.trim() || 'Interchick Tanzania',
      sourceType: newSourceType,
      stage: newStage,
      targetSellingPricePerBirdTZS: targetPrice,
      status: 'Active',
      notes: newBatchNotes.trim()
    };

    onAddBatch(newBatch);
    setShowBatchModal(false);
    setNewBatchName('');
    setNewBatchNotes('');
    setNewHatcheryOrderRef('');
  };

  // 1-Click Action to Confirm Physical Arrival of Interchick Chicks at Farm
  const handleReceiveChickOrder = (batchId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = batches.map((b) => {
      if (b.id === batchId) {
        return {
          ...b,
          deliveryStatus: 'Delivered to Farm' as const,
          currentQuantity: b.initialQuantity,
          entryDate: today,
          stage: 'Day 1-7 (Brooding & Starter)' as const,
          notes: `${b.notes || ''} [Vifaranga vimepokelewa shambani bandani tarehe ${today}]`.trim()
        };
      }
      return b;
    });
    onUpdateBatch(updated);
  };

  // Open Modal to Record Payment for Customer Credit (Kuku waliopelekwa bila kulipwa)
  const handleOpenPayModal = (sale: PoultrySale) => {
    setPayingSale(sale);
    const balance = sale.amountDueTZS !== undefined ? sale.amountDueTZS : Math.max(0, getSaleRevenue(sale) - (sale.amountPaidTZS || 0));
    setPayAmountTZS(balance);
    setPayMethod('Vodacom M-Pesa');
    setPayRef('');
    setShowPayModal(true);
  };

  // Submit Payment for Delivered Broilers
  const handleRecordSalePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingSale || !onUpdateSale) return;
    const paidAmount = Number(payAmountTZS) || 0;
    if (paidAmount <= 0) return;

    const totalRev = getSaleRevenue(payingSale);
    const previousPaid = payingSale.amountPaidTZS !== undefined ? payingSale.amountPaidTZS : (payingSale.paymentStatus === 'Paid' ? totalRev : 0);
    const newPaid = previousPaid + paidAmount;
    const newDue = Math.max(0, totalRev - newPaid);
    const newStatus: SalePaymentStatus = newDue <= 0 ? 'Paid' : 'Partial Payment';

    const updated = sales.map((s) => {
      if (s.id === payingSale.id) {
        return {
          ...s,
          paymentStatus: newStatus,
          amountPaidTZS: newPaid,
          amountDueTZS: newDue,
          paymentMethod: payMethod,
          paymentRef: payRef ? `${s.paymentRef ? s.paymentRef + ', ' : ''}${payRef}` : s.paymentRef,
          notes: `${s.notes || ''} [Malipo ya TSh ${paidAmount.toLocaleString()} yamepokelewa tarehe ${new Date().toISOString().split('T')[0]} kupitia ${payMethod}]`.trim()
        };
      }
      return s;
    });

    onUpdateSale(updated);
    setShowPayModal(false);
    setPayingSale(null);
  };

  // Handle Add Vaccination
  const handleCreateVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === vacBatchId) || batches[0];
    const newVac: VaccinationRecord = {
      id: `vac-tz-${Date.now()}`,
      batchId: selectedBatch?.id || 'general',
      batchName: selectedBatch?.batchName || 'General Flock',
      vaccineName: vacName.trim(),
      targetDate: vacTargetDate,
      administeredDate: vacTargetDate <= new Date().toISOString().split('T')[0] ? vacTargetDate : undefined,
      status: vacTargetDate < new Date().toISOString().split('T')[0] ? 'Completed' : 'Scheduled',
      route: vacRoute,
      costTZS: Number(vacCostTZS) || 0,
      administeredBy: vacAdminBy.trim() || 'Vet John (Mtaalamu wa Mifugo)',
      notes: vacNotes.trim()
    };

    onAddVaccination(newVac);
    setShowVaccineModal(false);
    setVacNotes('');
  };

  // Handle Mark Vaccine as Done
  const handleToggleVaccineDone = (vac: VaccinationRecord) => {
    const updated = vaccinations.map((v) => {
      if (v.id === vac.id) {
        return {
          ...v,
          status: v.status === 'Completed' ? ('Scheduled' as const) : ('Completed' as const),
          administeredDate: v.status === 'Completed' ? undefined : new Date().toISOString().split('T')[0]
        };
      }
      return v;
    });
    onUpdateVaccination(updated);
  };

  // Handle Add Feed
  const handleCreateFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === feedBatchId) || batches[0];
    const kg = Number(feedKg) || 0;
    const costPerKg = Number(feedCostPerKgTZS) || 0;
    const totalCost = kg * costPerKg;

    const newFeed: FeedRecord = {
      id: `feed-tz-${Date.now()}`,
      batchId: selectedBatch?.id || 'general',
      batchName: selectedBatch?.batchName || 'General Flock',
      date: feedDate,
      feedType,
      quantityKg: kg,
      costPerKgTZS: costPerKg,
      totalCostTZS: totalCost,
      brandOrSource: feedBrand.trim() || 'Interchick Feeds',
      notes: feedNotes.trim()
    };

    onAddFeed(newFeed);
    setShowFeedModal(false);
    setFeedNotes('');
  };

  // Handle Add Mortality
  const handleCreateMortality = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === mortBatchId) || batches[0];
    const count = Number(mortCount) || 1;

    const newMort: MortalityRecord = {
      id: `mort-tz-${Date.now()}`,
      batchId: selectedBatch?.id || 'general',
      batchName: selectedBatch?.batchName || 'General Flock',
      date: mortDate,
      deathCount: count,
      suspectedCause: mortCause,
      actionTaken: mortAction.trim(),
      notes: mortNotes.trim()
    };

    onAddMortality(newMort);

    // Auto deduct from active batch count
    if (selectedBatch) {
      const updatedBatches = batches.map((b) => {
        if (b.id === selectedBatch.id) {
          return {
            ...b,
            currentQuantity: Math.max(0, b.currentQuantity - count)
          };
        }
        return b;
      });
      onUpdateBatch(updatedBatches);
    }

    setShowMortalityModal(false);
    setMortNotes('');
  };

  // Handle Add Expense (Supports Pumba, Medecine, Maranda, etc.)
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === expBatchId);

    const newExp: PoultryExpense = {
      id: `pexp-tz-${Date.now()}`,
      batchId: selectedBatch?.id,
      batchName: selectedBatch?.batchName,
      date: expDate,
      category: expCategory,
      description: expDesc.trim(),
      amountTZS: Number(expAmountTZS) || 0,
      paidTo: expPaidTo.trim() || 'Agrovet / Mtoa Huduma',
      paymentMethod: expMethod,
      receiptRef: expReceipt.trim()
    };

    onAddExpense(newExp);
    setShowExpenseModal(false);
    setExpDesc('');
    setExpPaidTo('');
    setExpReceipt('');
  };

  // Handle Add Broiler Sale (Supports Kuku Waliopelekwa Bila Kulipwa / Customer Credit)
  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === saleBatchId) || batches[0];
    const qty = Number(saleQty) || 1;
    const unitPrice = Number(saleUnitPriceTZS) || 11000;
    const totalRev = qty * unitPrice;

    // Calculate Paid and Due amounts
    let amtPaid = totalRev;
    let amtDue = 0;
    if (salePaymentStatus === 'Unpaid / Pending Payment') {
      amtPaid = 0;
      amtDue = totalRev;
    } else if (salePaymentStatus === 'Partial Payment') {
      amtPaid = Math.min(totalRev, Math.max(0, Number(saleAmountPaidTZS) || 0));
      amtDue = Math.max(0, totalRev - amtPaid);
    }

    const newSale: PoultrySale = {
      id: `sale-tz-${Date.now()}`,
      batchId: selectedBatch?.id || 'general',
      batchName: selectedBatch?.batchName || 'General Flock',
      date: saleDate,
      saleType,
      quantitySold: qty,
      sellingPricePerUnitTZS: unitPrice,
      totalRevenueTZS: totalRev,
      buyerName: saleBuyer.trim() || 'Mteja wa Kuku',
      buyerPhone: salePhone.trim() || '0757895896',
      deliveryStatus: saleDeliveryStatus,
      deliveredDate: saleDate,
      paymentStatus: salePaymentStatus,
      amountPaidTZS: amtPaid,
      amountDueTZS: amtDue,
      paymentDueDate: salePaymentStatus !== 'Paid' ? saleDueDate : undefined,
      paymentMethod: salePaymentStatus === 'Unpaid / Pending Payment' ? 'Credit / Bado Kulipwa' : saleMethod,
      paymentRef: salePaymentRef.trim(),
      notes: saleNotes.trim()
    };

    onAddSale(newSale);

    // Auto deduct sold birds if live or dressed broiler meat
    const isLiveOrMeat =
      saleType === 'Live Broilers (Kuku Hai)' ||
      saleType === 'Dressed / Slaughtered Meat (Nyama)' ||
      saleType === 'Live Birds' ||
      saleType === 'Dressed / Slaughtered Meat' ||
      saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)';

    if (selectedBatch && isLiveOrMeat) {
      const updatedBatches = batches.map((b) => {
        if (b.id === selectedBatch.id) {
          return {
            ...b,
            currentQuantity: Math.max(0, b.currentQuantity - qty)
          };
        }
        return b;
      });
      onUpdateBatch(updatedBatches);
    }

    // AUTOMATIC PROFIT & LOSS RECOMPUTATION AFTER THE SALE
    const updatedRevenue = financialSummary.totalRevenueTZS + totalRev;
    const updatedNetProfit = updatedRevenue - financialSummary.grandTotalExpensesTZS;
    
    setLastSaleFeedback({
      id: newSale.id,
      batchName: newSale.batchName,
      qty,
      saleType,
      unitPrice,
      totalRevenue: totalRev,
      newNetProfit: updatedNetProfit,
      isProfit: updatedNetProfit >= 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setShowSaleModal(false);
    setSaleBuyer('');
    setSalePaymentRef('');
    setSaleNotes('');
    setSalePaymentStatus('Paid');
    setSaleAmountPaidTZS(330000);
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATIC POST-SALE PROFIT & LOSS ALERT (AUTOMATIQUE CALCULATION FEEDBACK) */}
      {lastSaleFeedback && (
        <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-400 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shrink-0 text-emerald-300 text-lg font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-200">
                  Mauzo Yamehifadhiwa Kiotomatiki! (Sale Saved &amp; Auto P&amp;L Updated)
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-100 font-mono px-2 py-0.5 rounded-full border border-emerald-400/40">
                  {lastSaleFeedback.timestamp}
                </span>
              </div>
              <p className="text-xs text-stone-200">
                Kuku wa Broiler <span className="font-bold text-white font-mono">{lastSaleFeedback.qty}</span> ({lastSaleFeedback.saleType}) kutoka <span className="font-semibold text-amber-300">{lastSaleFeedback.batchName}</span>. Mapato: <span className="font-bold font-mono text-emerald-300">+{formatTZS(lastSaleFeedback.totalRevenue)}</span>.
              </p>
              <p className="text-xs text-emerald-100 font-medium">
                Faida / Hasara Halisi ya Shamba imehesabiwa kiotomatiki: <span className="font-bold font-mono text-amber-300">{lastSaleFeedback.isProfit ? '+' : '-'}{formatTZS(Math.abs(lastSaleFeedback.newNetProfit))}</span> ({lastSaleFeedback.isProfit ? 'Faida Halisi (Net Profit)' : 'Hasara (Deficit)'}).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
            {sales.find((s) => s.id === lastSaleFeedback.id) && (
              <a
                href={
                  sales.find((s) => s.id === lastSaleFeedback.id)?.paymentStatus === 'Paid'
                    ? generateWhatsAppSaleReceipt(sales.find((s) => s.id === lastSaleFeedback.id)!)
                    : generateWhatsAppDebtReminder(sales.find((s) => s.id === lastSaleFeedback.id)!)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                title="Tuma risiti au kumbusho WhatsApp kwa mteja"
              >
                <MessageCircle className="w-3.5 h-3.5 text-stone-950" />
                <span>Tuma WhatsApp</span>
              </a>
            )}
            <button
              onClick={() => {
                setActiveTab('pnl');
                setSelectedPnlMonth('all');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Tazama Ripoti ya P&amp;L</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLastSaleFeedback(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
              title="Funga taarifa hii"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Banner & Fast Action Bar (Accessible on Computer & Phone) */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Brand Identity with Noticeably Larger Logo */}
          <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
            {/* Enlarged Logo Container */}
            <div className="relative shrink-0">
              <img
                src="/blessed_poultry_logo.jpg"
                alt="Blessed Poultry Official Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-full object-cover border-3 border-amber-400 shadow-xl ring-4 ring-amber-400/20"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 text-sm bg-stone-900 rounded-full px-1.5 py-0.5 border border-amber-400 shadow-sm" title="Tanzania">
                🇹🇿
              </span>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
                  Blessed Poultry Tanzania
                </span>
                <span className="text-xs text-amber-200 font-medium">
                  {batches.length} Batches · {financialSummary.currentLiveBirds} Birds Live
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                Chicken &amp; Livestock Farm Management
              </h1>
              
              {/* Phone and Contact Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <a
                  href="tel:0757895896"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
                  title="Piga Simu / Call 0757 895 896"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>0757 895 896</span>
                </a>
                <a
                  href="https://wa.me/255757895896?text=Habari%20Blessed%20Poultry%20Tanzania"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-semibold transition"
                  title="Tuma Ujumbe WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>WhatsApp</span>
                </a>
                <span className="hidden sm:inline-flex items-center gap-1 text-stone-300">
                  <Mail className="w-3 h-3 text-stone-400" />
                  <span>blessedkapuya@gmail.com</span>
                </span>
                <span className="inline-flex items-center gap-1 text-stone-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Dar es Salaam &amp; Coast, TZ</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Triggers (Touch-Friendly on Phone & Computer) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800">
            <button
              onClick={() => setShowBatchModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer min-h-[42px]"
            >
              <Plus className="w-4 h-4" />
              <span>Ingiza Kuku (New Batch)</span>
            </button>

            <button
              onClick={() => setShowSaleModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[42px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Rekodi Mauzo (Sales)</span>
            </button>

            <button
              onClick={() => setShowMortalityModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[42px]"
            >
              <Skull className="w-4 h-4 text-red-200" />
              <span>Vifo (Mortality)</span>
            </button>

            <a
              href="/bareglow-book-and-management.zip"
              download="bareglow-book-and-management.zip"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer min-h-[42px]"
              title="Pakua Faili Kamili la Mradi (Download Complete Project ZIP)"
            >
              <Download className="w-4 h-4 text-stone-950" />
              <span>Pakua ZIP</span>
            </a>

            {onResetToTanzaniaData && (
              <button
                onClick={onResetToTanzaniaData}
                className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition cursor-pointer"
                title="Weka Data za Mfano za Tanzania (Reset Sample Data)"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Data za TZ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CLOUD DATA SAFETY & DEVICE DAMAGE PROTECTION BANNER (TANZANIA STANDARDS) */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/60 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 text-xl font-bold shadow-inner">
              🛡️
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-200 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Data Zako Ziko Salama 100% Kwenye Wingu (Google Cloud Firestore Protected)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {cloudConnected ? '🟢 Live Cloud Connected' : '🟡 Offline Mode Active'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                Hata simu yako <strong>ikiharibika, ikipotea, au ikizama kwenye maji</strong>, data yako haipotei kamwe! Ukifungua link hii kwenye simu nyingine au kompyuta yoyote, rekodi zako zote za kuku na mauzo zinarudi mara moja bila kupoteza hata kuku mmoja.
              </p>
            </div>
          </div>

          {/* Backup & Sync Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/60">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[40px]"
              title="Bofya kusawazisha data na Google Cloud Firestore papo hapo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Inasawazisha...' : 'Sawazisha Sasa'}</span>
            </button>

            <button
              onClick={handleExportFarmBackup}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer min-h-[40px]"
              title="Pakua nakala ya data zote za shamba (.json) na uhifadhi WhatsApp au Google Drive"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Pakua Backup (.json)</span>
            </button>

            <label
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer min-h-[40px]"
              title="Rejesha faili la backup kutoka kwenye simu au kompyuta yako"
            >
              <Upload className="w-3.5 h-3.5 text-blue-300" />
              <span>Rejesha (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFarmBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {syncToast && (
          <div className="mt-3 text-xs bg-emerald-900/90 border border-emerald-400 text-emerald-100 p-2.5 rounded-xl flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2 font-medium">
              <span className="text-emerald-300 font-bold">✓</span> {syncToast}
            </span>
            <button onClick={() => setSyncToast(null)} className="text-emerald-300 hover:text-white font-bold px-2 py-0.5">✕</button>
          </div>
        )}
      </div>

      {/* Primary KPI Strips - Responsive on Both Phone and Computer Screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Live Birds */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Kuku Waliopo (Live Birds)</span>
            <Layers className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {financialSummary.currentLiveBirds.toLocaleString()}
            <span className="text-xs font-normal text-stone-500 ml-1.5 font-sans">ndege</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>Waliyonunuliwa: {financialSummary.totalBirdsPurchased}</span>
            <span>Waliyouzwa: {financialSummary.totalBirdsSold}</span>
          </div>
        </div>

        {/* KPI 2: Mortality Rate */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Vifo / Hasara (Mortality)</span>
            <AlertTriangle className={`w-4 h-4 ${financialSummary.mortalityRatePercent > 5 ? 'text-red-600' : 'text-stone-400'}`} />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {financialSummary.totalMortality}
            <span className={`text-xs ml-1.5 font-sans ${financialSummary.mortalityRatePercent > 5 ? 'text-red-600 font-bold' : 'text-stone-500'}`}>
              ({financialSummary.mortalityRatePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Kiwango cha kawaida: &lt; 5% Broiler / &lt; 8% Layers
          </div>
        </div>

        {/* KPI 3: Total Expenses (Birds + Feed + Pumba + Meds + Misc) */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Gharama Zote (Expenses)</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums truncate">
            {formatTZS(financialSummary.grandTotalExpensesTZS)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            Chakula/Pumba: {formatTZS(financialSummary.totalFeedExpenseTZS + financialSummary.totalPumbaExpenseTZS)}
          </div>
        </div>

        {/* KPI 4: Net Profit or Loss */}
        <div className={`p-4 rounded-2xl border shadow-xs ${
          financialSummary.isProfit ? 'bg-emerald-50/70 border-emerald-200' : 'bg-red-50/70 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className={financialSummary.isProfit ? 'text-emerald-900 font-bold' : 'text-red-900 font-bold'}>
              Faida / Hasara ({financialSummary.isProfit ? 'Faida / Profit' : 'Hasara / Loss'})
            </span>
            {financialSummary.isProfit ? (
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-700" />
            )}
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
            financialSummary.isProfit ? 'text-emerald-950' : 'text-red-950'
          }`}>
            {financialSummary.isProfit ? '+' : '-'} {formatTZS(Math.abs(financialSummary.netProfitLossTZS))}
          </div>
          <div className="text-[11px] text-stone-600 mt-1 truncate">
            Mauzo: <span className="font-mono font-bold">{formatTZS(financialSummary.totalRevenueTZS)}</span>
          </div>
        </div>
      </div>

      {/* CORE FEATURE STRIP: UNPAID BROILER DELIVERIES & INTERCHICK ORDERS AWAITING DELIVERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Card A: Day-Old Chicks Ordered & Paid from Interchick (Awaiting Delivery) */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 text-lg shadow-xs">
                🐣
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Agizo la Vifaranga (Supplier Advance Payment)
                </span>
                <h4 className="font-bold text-sm text-stone-900">
                  Vifaranga Vilivyolipwa Interchick (Bado Kufika Shambani)
                </h4>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 shrink-0">
              {financialSummary.pendingChickOrdersCount > 0 ? 'Wanasubiriwa' : 'Hakuna Oda'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-amber-200/80 bg-white/60 rounded-xl px-3">
            <div>
              <span className="text-[10px] text-stone-500 block">Idadi Iliyolipwa Interchick:</span>
              <span className="font-mono font-bold text-amber-950 text-base">
                {financialSummary.pendingChickOrdersCount.toLocaleString()} <span className="text-xs font-normal text-stone-600">vifaranga</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">Pesa Iliyolipwa Mapema (Advance):</span>
              <span className="font-mono font-bold text-stone-900 text-sm">
                {formatTZS(financialSummary.pendingChickOrdersCostTZS)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-amber-900">
              {financialSummary.pendingChickOrdersCount > 0
                ? 'Havijahesabiwa kwenye kuku wa bandani mpaka vitakapofika.'
                : 'Hakuna vifaranga vinavyosubiriwa kutoka kwa wazalishaji.'}
            </span>
            <button
              onClick={() => {
                setActiveTab('batches');
                setBatchDeliveryFilter('ordered');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Tazama Oda &amp; Pokea</span>
            </button>
          </div>
        </div>

        {/* Card B: Chickens Delivered But Not Paid For (Madeni ya Wateja / Accounts Receivable) */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-red-50 to-rose-50 border-2 border-red-300 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-200 text-red-900 flex items-center justify-center shrink-0 text-lg shadow-xs">
                ⚠️
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                  Madeni ya Wateja (Accounts Receivable)
                </span>
                <h4 className="font-bold text-sm text-stone-900">
                  Kuku Waliopelekwa Wasiozalipwa (Deni la Wateja)
                </h4>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-200 text-red-950 border border-red-300 shrink-0">
              {financialSummary.unpaidBirdsCount > 0 ? 'Inadaiwa' : 'Hakuna Deni'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-red-200/80 bg-white/60 rounded-xl px-3">
            <div>
              <span className="text-[10px] text-stone-500 block">Kiasi Kinachodaiwa (Madeni):</span>
              <span className="font-mono font-bold text-red-700 text-base">
                {formatTZS(financialSummary.totalUnpaidReceivablesTZS)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">Kuku Waliopelekwa Bila Malipo:</span>
              <span className="font-mono font-bold text-stone-900 text-sm">
                {financialSummary.unpaidBirdsCount} <span className="text-xs font-normal text-stone-600">kuku</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-stone-600">
              Pesa iliyokusanywa taslimu: <strong className="font-mono text-emerald-800">{formatTZS(financialSummary.totalCashCollectedTZS)}</strong>
            </span>
            <button
              onClick={() => {
                setActiveTab('sales');
                setSalePaymentFilter('unpaid');
              }}
              className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Tazama &amp; Rekodi Malipo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Horizontally Scrollable for Mobile & Clean on Computer) */}
      <div className="flex gap-1.5 border-b border-stone-200 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: '📊 Flock Dashboard' },
          { id: 'batches', label: `🐔 Batches (${batches.length})` },
          { id: 'vaccines', label: `💉 Chanjo (${vaccinations.filter(v => v.status === 'Scheduled').length} Pending)` },
          { id: 'feed', label: `🌾 Chakula (${feeds.length} Logs)` },
          { id: 'expenses', label: `💰 Pumba & Medecine (${expenses.length})` },
          { id: 'mortality', label: `⚠️ Vifo (${mortalities.length})` },
          { id: 'sales', label: `🛒 Mauzo (${sales.length})` },
          { id: 'pnl', label: '📈 Faida & Hasara (P&L)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[38px] ${
              activeTab === tab.id
                ? 'bg-white text-stone-900 border-t-2 border-l border-r border-stone-200 border-t-amber-500 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Matrix for Attendants & Farm Manager */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setShowBatchModal(true)}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:bg-amber-50/50 transition text-left cursor-pointer shadow-xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-stone-900 block">Kununua Kuku</span>
              <span className="text-[11px] text-stone-500">Entry Date, Bei (TZS) &amp; Idadi</span>
            </button>

            <button
              onClick={() => openExpenseForCategory('Pumba (Pumba ya Mahindi / Mpunga)', 'Pumba ya Mahindi safi (Magunia)', 36000)}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 transition text-left cursor-pointer shadow-xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                <Wheat className="w-4 h-4 text-amber-900" />
              </div>
              <span className="font-bold text-xs text-stone-900 block">Gharama ya Pumba</span>
              <span className="text-[11px] text-amber-800">Pumba ya Mahindi / Mpunga</span>
            </button>

            <button
              onClick={() => openExpenseForCategory('Medecine & Dawa (Antibiotics, Vitamins, Dewormers)', 'Dawa & Vitamini (Medecine)', 45000)}
              className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition text-left cursor-pointer shadow-xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-200 text-blue-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                <Pill className="w-4 h-4 text-blue-900" />
              </div>
              <span className="font-bold text-xs text-stone-900 block">Gharama ya Medecine</span>
              <span className="text-[11px] text-blue-800">Dawa, Vitamini &amp; Kinga</span>
            </button>

            <button
              onClick={() => setShowSaleModal(true)}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:bg-emerald-50/50 transition text-left cursor-pointer shadow-xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-stone-900 block">Kuuza Kuku / Mayai</span>
              <span className="text-[11px] text-stone-500">Kuku hai, nyama au kreti</span>
            </button>
          </div>

          {/* Active Batches Status Grid */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Usimamizi wa Mabanda ya Kuku (Flock Performance by Batch)
                </h3>
                <p className="text-xs text-stone-500">
                  Fuatilia idadi ya kuku waliopo hai, gharama zote zilizotumika, na makadirio ya mauzo nchini Tanzania.
                </p>
              </div>
              <button
                onClick={() => setShowBatchModal(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 transition underline cursor-pointer"
              >
                + Weka Batch Mpya
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {batchAnalytics.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        {b.breed} · {b.stage}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 leading-tight">
                        {b.batchName}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      {b.status}
                    </span>
                  </div>

                  {/* Broiler 35-Day Growth Countdown & Market Readiness */}
                  {b.isAwaitingDelivery ? (
                    <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <span>🐣</span>
                          <span>Inasubiriwa Kutoka Interchick</span>
                        </span>
                        <span className="font-mono text-[11px]">Kufika: {b.expectedDeliveryDate || b.entryDate}</span>
                      </div>
                      <p className="text-[10px] text-amber-900 mt-0.5">
                        Vifaranga vimeshalipwa mapema. Vinahesabiwa bandani mara tu vinapowasili.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Umri: Siku ya <strong className="text-stone-950 font-mono text-sm">{b.ageDays}</strong> / 35</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.ageDays >= 35
                            ? 'bg-emerald-200 text-emerald-950 border border-emerald-400'
                            : b.ageDays >= 28
                            ? 'bg-amber-200 text-amber-950 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {b.ageDays >= 35 ? '🟢 Tayari Kuvunwa (~2.0kg)' : b.ageDays >= 28 ? '🟡 Wiki ya Mwisho (Finisher)' : '🔵 Hatua ya Kukua'}
                        </span>
                      </div>
                      {/* Growth Progress Bar */}
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            b.ageDays >= 35 ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${b.harvestProgressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span>{b.daysUntilHarvest > 0 ? `Siku ${b.daysUntilHarvest} zimebaki kufikia siku 35` : 'Amefikia siku kamili za soko (siku 35+)'}</span>
                        <span className="font-mono font-bold">{b.harvestProgressPercent}%</span>
                      </div>
                    </div>
                  )}

                  {/* Batch Metric Numbers */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-b border-stone-200/80">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Tarehe &amp; Idadi ya Mwanzo</span>
                      <span className="font-mono font-bold text-stone-800">
                        {b.entryDate} ({b.initialQuantity} kuku)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Waliopo Hai Sasa</span>
                      <span className="font-mono font-bold text-emerald-900 text-sm">
                        {b.liveRemaining} <span className="text-[10px] font-normal text-stone-500">hai</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Bei ya Kununua (TZS)</span>
                      <span className="font-mono text-stone-700">{formatTZS(b.unitPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Lengo la Kuuza (TZS)</span>
                      <span className="font-mono font-bold text-amber-900">{formatTZS(b.targetPrice)}</span>
                    </div>
                  </div>

                  {/* Unit Economics: Cost to Produce 1 Broiler & Profit Margin */}
                  <div className="p-2 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-700 font-medium">Gharama ya Kuku 1:</span>
                      <span className="font-mono font-bold text-stone-900">{formatTZS(b.costPerBird)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-700 font-medium">Bei ya Kuuza:</span>
                      <span className="font-mono font-bold text-amber-900">{formatTZS(b.targetPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-200 font-bold">
                      <span className="text-emerald-950">Faida Halisi / Kuku:</span>
                      <span className={`font-mono ${b.profitPerBird >= 0 ? 'text-emerald-800 font-extrabold' : 'text-red-700'}`}>
                        {b.profitPerBird >= 0 ? '+' : ''}{formatTZS(b.profitPerBird)}
                      </span>
                    </div>
                  </div>

                  {/* Financial Bar */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-stone-600">
                      <span>Jumla Iliyotumika (Kuku+Chakula+Meds):</span>
                      <span className="font-mono font-semibold">{formatTZS(b.totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Mauzo Yaliyopatikana:</span>
                      <span className="font-mono font-bold text-emerald-700">{formatTZS(b.realizedRevenue)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                      <span>Nafasi ya Faida / Hasara:</span>
                      <span className={`font-mono ${b.realizedNetProfit >= 0 ? 'text-emerald-700' : 'text-stone-700'}`}>
                        {b.realizedNetProfit >= 0 ? '+' : ''} {formatTZS(b.realizedNetProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500 italic">
                      <span>Makadirio yote yakiuzwa:</span>
                      <span className="font-mono font-bold text-stone-800">
                        {formatTZS(b.projectedNetProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Vaccinations Alert Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-blue-950">
                  Ratiba ya Chanjo (Vaccination Schedule)
                </h4>
                <p className="text-xs text-blue-800">
                  Zuia magonjwa ya Kideri / Mdondo (Newcastle), Gumboro, Ndui ya kuku kwa kufuata ratiba sahihi ya siku.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('vaccines')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 transition cursor-pointer shrink-0"
            >
              Tazama Chanjo Zote ({vaccinations.length})
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CHICKEN BATCHES (ENTRY DATE, BUYING PRICE & QUANTITY & INTERCHICK ORDERS) */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          {/* Filter Bar for Batches */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Rejesta ya Kuingiza Kuku &amp; Oda za Vifaranga (Batches &amp; Interchick Orders)
              </h3>
              <p className="text-xs text-stone-500">
                Fuatilia kuku waliopo bandani shambani na vifaranga vilivyoagizwa/kulipwa Interchick vinavyosubiriwa kufika.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setBatchDeliveryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  batchDeliveryFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Mabanda Yote ({batches.length})
              </button>
              <button
                onClick={() => setBatchDeliveryFilter('delivered')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  batchDeliveryFilter === 'delivered'
                    ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                <span>🟢 Shambani Bandani ({batches.filter(b => b.deliveryStatus !== 'Ordered & Paid (Awaiting Delivery)').length})</span>
              </button>
              <button
                onClick={() => setBatchDeliveryFilter('ordered')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  batchDeliveryFilter === 'ordered'
                    ? 'bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-300 font-extrabold'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                }`}
              >
                <span>🐣 Vifaranga vya Interchick ({batches.filter(b => b.deliveryStatus === 'Ordered & Paid (Awaiting Delivery)').length})</span>
              </button>
              <button
                onClick={() => setShowBatchModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer ml-1"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ingiza / Agiza Kuku</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Batch / Banda</th>
                    <th className="py-3 px-4">Hali ya Kuwasili (Delivery Status)</th>
                    <th className="py-3 px-4">Aina ya Kuku (Breed)</th>
                    <th className="py-3 px-4">Tarehe / Oda Ref</th>
                    <th className="py-3 px-4 text-right">Idadi ya Awali</th>
                    <th className="py-3 px-4 text-right">Waliopo Bandani</th>
                    <th className="py-3 px-4 text-right">Bei ya Kifaranga</th>
                    <th className="py-3 px-4 text-right">Jumla Iliyolipwa</th>
                    <th className="py-3 px-4 text-right">Lengo la Kuuza</th>
                    <th className="py-3 px-4 text-center">Hatua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {batches
                    .filter((b) => {
                      if (batchDeliveryFilter === 'delivered') return b.deliveryStatus !== 'Ordered & Paid (Awaiting Delivery)';
                      if (batchDeliveryFilter === 'ordered') return b.deliveryStatus === 'Ordered & Paid (Awaiting Delivery)';
                      return true;
                    })
                    .map((b) => {
                      const isAwaiting = b.deliveryStatus === 'Ordered & Paid (Awaiting Delivery)';
                      return (
                        <tr key={b.id} className={`transition ${isAwaiting ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-stone-50/70'}`}>
                          <td className="py-3 px-4 font-semibold text-stone-900">
                            <div>{b.batchName}</div>
                            <span className="text-[10px] text-stone-500 font-normal">{b.supplier}</span>
                          </td>
                          <td className="py-3 px-4">
                            {isAwaiting ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-300">
                                  <span>🐣</span>
                                  <span>Bado Kufika (Interchick)</span>
                                </span>
                                <div className="text-[10px] text-amber-800 font-mono">
                                  Kufika: {b.expectedDeliveryDate || b.entryDate}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <span>🟢</span>
                                <span>Shambani Bandani</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                              {b.breed}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <div>{b.entryDate}</div>
                            {b.hatcheryOrderRef && (
                              <span className="text-[10px] text-stone-500 block">Ref: {b.hatcheryOrderRef}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-right font-bold text-stone-800">
                            {b.initialQuantity}
                          </td>
                          <td className="py-3 px-4 font-mono text-right font-bold">
                            {isAwaiting ? (
                              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs">
                                0 <span className="text-[10px] font-normal font-sans">(bado kufika)</span>
                              </span>
                            ) : (
                              <span className="text-emerald-800 text-sm">
                                {b.currentQuantity} <span className="text-[10px] font-normal font-sans text-stone-500">hai</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-right">
                            {formatTZS(getBatchPricePerBird(b))}
                          </td>
                          <td className="py-3 px-4 font-mono text-right font-bold text-stone-900">
                            {formatTZS(getBatchCost(b))}
                          </td>
                          <td className="py-3 px-4 font-mono text-right text-amber-900 font-bold">
                            {formatTZS(getBatchTargetPrice(b))}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isAwaiting ? (
                              <button
                                onClick={() => handleReceiveChickOrder(b.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                                title="Bonyeza kuthibitisha kuwa vifaranga vimefika bandani leo"
                              >
                                <Check className="w-3 h-3" />
                                <span>Pokea Bandani</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-stone-400">Bandani</span>
                            )}
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

      {/* TAB 3: VACCINATION CALENDAR */}
      {activeTab === 'vaccines' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Ratiba ya Chanjo (Vaccination &amp; Medical Calendar)
              </h3>
              <p className="text-xs text-stone-500">
                Tarehe ya chanjo, aina ya chanjo (Gumboro, Newcastle / Mdondo, Ndui), njia ya kutoa na gharama za mifugo (TZS).
              </p>
            </div>
            <button
              onClick={() => setShowVaccineModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ratiba Chanjo Mpya</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Chanjo (Vaccine)</th>
                  <th className="py-3 px-4">Njia ya Kutoa (Route)</th>
                  <th className="py-3 px-4">Mtoa Chanjo</th>
                  <th className="py-3 px-4 text-right">Gharama (TZS)</th>
                  <th className="py-3 px-4">Hali (Status)</th>
                  <th className="py-3 px-4 text-center">Hatua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {vaccinations.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 font-mono">{v.targetDate}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{v.batchName}</td>
                    <td className="py-3 px-4 font-bold text-blue-900">{v.vaccineName}</td>
                    <td className="py-3 px-4">{v.route}</td>
                    <td className="py-3 px-4 text-stone-600">{v.administeredBy}</td>
                    <td className="py-3 px-4 font-mono text-right font-bold">
                      {formatTZS(getVacCost(v))}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {v.status === 'Completed' ? 'Imekamilika' : 'Imepangwa'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleVaccineDone(v)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                      >
                        {v.status === 'Completed' ? 'Weka Haijakamilika' : 'Tia Alama Imekamilika'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEED CONSUMPTION */}
      {activeTab === 'feed' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Matumizi ya Chakula cha Kuku (Feed Consumption Tracking)
              </h3>
              <p className="text-xs text-stone-500">
                Kiasi cha chakula kilicholiwa (Kg), aina (Starter, Finisher, Mash), bei kwa kilo (TZS), na jumla ya gharama.
              </p>
            </div>
            <button
              onClick={() => setShowFeedModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Rekodi Chakula Kilicholiwa</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Aina ya Chakula</th>
                  <th className="py-3 px-4">Chapa / Chanzo</th>
                  <th className="py-3 px-4 text-right">Uzito (Kg)</th>
                  <th className="py-3 px-4 text-right">Bei / Kg</th>
                  <th className="py-3 px-4 text-right">Jumla (TZS)</th>
                  <th className="py-3 px-4">Maelezo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {feeds.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 font-mono">{f.date}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{f.batchName}</td>
                    <td className="py-3 px-4 font-medium">{f.feedType}</td>
                    <td className="py-3 px-4 text-stone-600">{f.brandOrSource}</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-stone-900">{f.quantityKg} Kg</td>
                    <td className="py-3 px-4 font-mono text-right">{formatTZS(getFeedCostPerKg(f))}</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-amber-900">
                      {formatTZS(getFeedCost(f))}
                    </td>
                    <td className="py-3 px-4 text-stone-500 truncate max-w-[200px]">{f.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: OTHER EXPENSES (PUMBA, MEDECINE, WOOD SHAVINGS, LABOUR, ETC.) */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Quick Expense Shortcuts explicitly for PUMBA and MEDECINE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => openExpenseForCategory('Pumba (Pumba ya Mahindi / Mpunga)', 'Pumba ya Mahindi safi (Magunia 5 @ TSh 18,000)', 90000)}
              className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100/80 transition text-left cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Kipengele Maalum</span>
                <span className="font-bold text-sm text-stone-900">+ Weka Gharama ya PUMBA</span>
                <span className="text-[11px] text-stone-600 block">Pumba ya mahindi / mpunga</span>
              </div>
              <Wheat className="w-6 h-6 text-amber-700" />
            </button>

            <button
              onClick={() => openExpenseForCategory('Medecine & Dawa (Antibiotics, Vitamins, Dewormers)', 'Medecine: ESB3 + Amin\'Total Vitamini za Maji', 65000)}
              className="p-3.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100/80 transition text-left cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-800 block">Kipengele Maalum</span>
                <span className="font-bold text-sm text-stone-900">+ Weka Gharama ya MEDECINE</span>
                <span className="text-[11px] text-stone-600 block">Dawa za kuku, vitamini, dewormer</span>
              </div>
              <Pill className="w-6 h-6 text-blue-700" />
            </button>

            <button
              onClick={() => setShowExpenseModal(true)}
              className="p-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 transition text-left cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Uendeshaji wa Shamba</span>
                <span className="font-bold text-sm text-stone-900">+ Gharama Nyingine (Other)</span>
                <span className="text-[11px] text-stone-600 block">Maranda, mkaa, umeme, mshahara</span>
              </div>
              <Plus className="w-6 h-6 text-stone-700" />
            </button>
          </div>

          {/* Month Filter for Expenses */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-700">Chuja Gharama za Shamba kwa Mwezi:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedExpMonth('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedExpMonth === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Miezi Yote ({expenses.length})
              </button>
              {allAvailableMonths.map((mKey) => {
                const count = expenses.filter((e) => getMonthKey(e.date) === mKey).length;
                return (
                  <button
                    key={mKey}
                    onClick={() => setSelectedExpMonth(mKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedExpMonth === mKey
                        ? 'bg-amber-400 text-stone-950 shadow-xs ring-2 ring-amber-300'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {formatMonthLabel(mKey)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expense Sub-Totals Strip (Calculated dynamically for selected month) */}
          {(() => {
            const expList = selectedExpMonth === 'all' ? expenses : expenses.filter((e) => getMonthKey(e.date) === selectedExpMonth);
            const pumbaSum = expList.filter((e) => e.category === 'Pumba (Pumba ya Mahindi / Mpunga)').reduce((sum, e) => sum + getExpAmount(e), 0);
            const medSum = expList.filter((e) => e.category === 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)').reduce((sum, e) => sum + getExpAmount(e), 0);
            const totalSum = expList.reduce((sum, e) => sum + getExpAmount(e), 0);
            const otherSum = totalSum - pumbaSum - medSum;
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold">PUMBA {selectedExpMonth !== 'all' ? `(${formatMonthLabel(selectedExpMonth)})` : ''}:</span>
                  <span className="font-mono font-bold text-amber-950 text-sm">
                    {formatTZS(pumbaSum)}
                  </span>
                </div>
                <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200">
                  <span className="text-blue-800 block text-[10px] uppercase font-bold">MEDECINE {selectedExpMonth !== 'all' ? `(${formatMonthLabel(selectedExpMonth)})` : ''}:</span>
                  <span className="font-mono font-bold text-blue-950 text-sm">
                    {formatTZS(medSum)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Maranda, Mkaa, Vibara:</span>
                  <span className="font-mono font-bold text-stone-800 text-sm">
                    {formatTZS(otherSum)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                  <span className="text-red-800 block text-[10px] uppercase font-bold">Jumla ya Gharama {selectedExpMonth !== 'all' ? `(${formatMonthLabel(selectedExpMonth)})` : ''}:</span>
                  <span className="font-mono font-bold text-red-950 text-sm">
                    {formatTZS(totalSum)}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Rejesta ya Gharama za Shamba {selectedExpMonth !== 'all' ? `· ${formatMonthLabel(selectedExpMonth)}` : ''}
                </h3>
                <p className="text-xs text-stone-500">
                  Pumba, Medecine, maranda, mkaa wa joto, umeme, vibarua na usafi wa mabanda ya broilers.
                </p>
              </div>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Rekodi Gharama Mpya</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tarehe</th>
                    <th className="py-3 px-4">Kundi (Category)</th>
                    <th className="py-3 px-4">Maelezo</th>
                    <th className="py-3 px-4">Mlipwaji (Paid To)</th>
                    <th className="py-3 px-4">Njia ya Malipo &amp; Risiti</th>
                    <th className="py-3 px-4 text-right">Kiasi (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {(selectedExpMonth === 'all' ? expenses : expenses.filter((e) => getMonthKey(e.date) === selectedExpMonth)).map((e) => (
                    <tr key={e.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-mono">{e.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.category.includes('Pumba')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : e.category.includes('Medecine')
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-700">{e.description}</td>
                      <td className="py-3 px-4 text-stone-600">{e.paidTo}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {e.paymentMethod} {e.receiptRef ? `(${e.receiptRef})` : ''}
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-stone-900">
                        {formatTZS(getExpAmount(e))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MORTALITY LOG */}
      {activeTab === 'mortality' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Kumbukumbu ya Vifo vya Kuku (Mortality Register)
              </h3>
              <p className="text-xs text-stone-500">
                Kila kifo kinapopungua kinajiondoa kiotomatiki kwenye idadi ya kuku waliopo hai bandani.
              </p>
            </div>
            <button
              onClick={() => setShowMortalityModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Rekodi Vifo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4 text-right">Idadi ya Vifo</th>
                  <th className="py-3 px-4">Sababu Iliyohisiwa</th>
                  <th className="py-3 px-4">Hatua Zilizochukuliwa</th>
                  <th className="py-3 px-4">Maelezo ya Ziada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {mortalities.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 font-mono">{m.date}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{m.batchName}</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-red-600">
                      {m.deathCount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
                        {m.suspectedCause}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">{m.actionTaken}</td>
                    <td className="py-3 px-4 text-stone-500">{m.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SALES REGISTER & SELLING PRICE (BROILERS ONLY) */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🍗</span>
              <span className="text-amber-950 font-medium">
                <strong className="font-bold">Ufugaji wa Broilers Pekee (Meat Birds Only):</strong> Shamba la Blessed Poultry linauza kuku hai wa broiler na nyama ya kuku waliochinjwa (hakuna mauzo ya mayai).
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] shrink-0 border border-emerald-300">
              ⚡ Hesabu ya Faida &amp; Hasara Kiotomatiki
            </span>
          </div>

          {/* Sales Filter and Accounts Receivable Header */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Rejesta ya Mauzo ya Broiler &amp; Madeni ya Wateja (Sales &amp; Accounts Receivable)
                </h3>
                <p className="text-xs text-stone-500">
                  Fuatilia mauzo yaliyolipwa kamili, kuku waliopelekwa lakini bado hawajalipwa (madeni), na malipo ya kiasi.
                </p>
              </div>

              <button
                onClick={() => setShowSaleModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Rekodi Mauzo Mapya</span>
              </button>
            </div>

            {/* Quick Receivables & Cash Collected Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Jumla ya Mauzo Yote:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {formatTZS(financialSummary.totalRevenueTZS)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">Pesa Zilizokusanywa (Cash/M-Pesa):</span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  {formatTZS(financialSummary.totalCashCollectedTZS)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-800 uppercase font-bold block">Kuku Waliopelekwa Wasiozalipwa (Madeni):</span>
                <span className="font-mono font-bold text-red-700 text-sm">
                  {formatTZS(financialSummary.totalUnpaidReceivablesTZS)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-900 uppercase font-bold block">Kuku wa Deni (Idadi):</span>
                <span className="font-mono font-bold text-amber-950 text-sm">
                  {financialSummary.unpaidBirdsCount} <span className="text-xs font-normal font-sans text-stone-600">kuku wa nyama</span>
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-600 mr-1">Chuja kwa Hali ya Malipo:</span>
              <button
                onClick={() => setSalePaymentFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  salePaymentFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Mauzo Yote ({sales.length})
              </button>
              <button
                onClick={() => setSalePaymentFilter('unpaid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  salePaymentFilter === 'unpaid'
                    ? 'bg-red-700 text-white shadow-xs ring-2 ring-red-300'
                    : 'bg-red-50 hover:bg-red-100 text-red-900'
                }`}
              >
                <span>⚠️ Waliopelekwa Bila Malipo ({sales.filter(s => s.paymentStatus === 'Unpaid / Pending Payment' || s.paymentStatus === 'Partial Payment').length})</span>
              </button>
              <button
                onClick={() => setSalePaymentFilter('paid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  salePaymentFilter === 'paid'
                    ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                <span>🟢 Yaliyolipwa Kamili ({sales.filter(s => s.paymentStatus === 'Paid' || !s.paymentStatus).length})</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tarehe / Uwasilishaji</th>
                    <th className="py-3 px-4">Batch ya Broiler</th>
                    <th className="py-3 px-4">Aina ya Mauzo</th>
                    <th className="py-3 px-4">Mteja &amp; Mawasiliano</th>
                    <th className="py-3 px-4 text-right">Idadi ya Kuku</th>
                    <th className="py-3 px-4 text-right">Bei / Kuku</th>
                    <th className="py-3 px-4 text-right">Jumla Thamani</th>
                    <th className="py-3 px-4">Hali ya Malipo (Payment Status)</th>
                    <th className="py-3 px-4 text-center">Hatua za Malipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {sales
                    .filter((s) => {
                      if (salePaymentFilter === 'unpaid') return s.paymentStatus === 'Unpaid / Pending Payment' || s.paymentStatus === 'Partial Payment';
                      if (salePaymentFilter === 'paid') return s.paymentStatus === 'Paid' || !s.paymentStatus;
                      return true;
                    })
                    .map((s) => {
                      const isUnpaid = s.paymentStatus === 'Unpaid / Pending Payment';
                      const isPartial = s.paymentStatus === 'Partial Payment';
                      const hasDue = (s.amountDueTZS || 0) > 0 || isUnpaid;

                      return (
                        <tr key={s.id} className={`transition ${hasDue ? 'bg-red-50/30 hover:bg-red-50/70' : 'hover:bg-stone-50/70'}`}>
                          <td className="py-3 px-4 font-mono">
                            <div className="font-semibold text-stone-900">{s.date}</div>
                            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Kuku Wamepelekwa
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-900">{s.batchName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              {s.saleType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-700">
                            <div className="font-bold text-stone-900">{s.buyerName}</div>
                            {s.buyerPhone && (
                              <a href={`tel:${s.buyerPhone}`} className="text-[11px] text-blue-700 hover:underline font-mono">
                                {s.buyerPhone}
                              </a>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-right font-bold text-stone-900">
                            {s.quantitySold} {s.saleType.includes('Mbolea') ? 'mifuko' : 'kuku'}
                          </td>
                          <td className="py-3 px-4 font-mono text-right text-stone-700">
                            {formatTZS(getSaleUnitPrice(s))}
                          </td>
                          <td className="py-3 px-4 font-mono text-right font-bold text-emerald-900 text-sm">
                            {formatTZS(getSaleRevenue(s))}
                          </td>
                          <td className="py-3 px-4">
                            {isUnpaid ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-950 border border-red-300">
                                  <span>🔴</span>
                                  <span>Haijalipwa (Deni la Kuku)</span>
                                </span>
                                <div className="text-[10px] text-red-700 font-mono">
                                  Inadaiwa: <strong className="font-bold">{formatTZS(s.amountDueTZS !== undefined ? s.amountDueTZS : getSaleRevenue(s))}</strong>
                                </div>
                                {s.paymentDueDate && (
                                  <div className="text-[10px] text-stone-500 font-mono">
                                    Ahadi: {s.paymentDueDate}
                                  </div>
                                )}
                              </div>
                            ) : isPartial ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                                  <span>🟡</span>
                                  <span>Imelipwa Kiasi</span>
                                </span>
                                <div className="text-[10px] text-emerald-800 font-mono">
                                  Imelipwa: {formatTZS(s.amountPaidTZS || 0)}
                                </div>
                                <div className="text-[10px] text-red-700 font-mono font-bold">
                                  Baki: {formatTZS(s.amountDueTZS || 0)}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  <span>🟢</span>
                                  <span>Imelipwa Kamili</span>
                                </span>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  {s.paymentMethod}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                              {hasDue ? (
                                <>
                                  <button
                                    onClick={() => handleOpenPayModal(s)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                                    title="Rekodi fedha zilizolipwa kwa kuku hawa"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    <span>Lipa Deni</span>
                                  </button>
                                  <a
                                    href={generateWhatsAppDebtReminder(s)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-[11px] shadow-xs transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                                    title="Tuma kumbusho la deni la kuku kupitia WhatsApp kwa mteja"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Kumbusho WA</span>
                                  </a>
                                </>
                              ) : (
                                <a
                                  href={generateWhatsAppSaleReceipt(s)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                                  title="Tuma risiti ya mauzo kupitia WhatsApp kwa mteja"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Risiti WA</span>
                                </a>
                              )}
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

      {/* TAB 8: PROFIT & LOSS STATEMENT & MONTHLY EXPENSES (TANZANIA SHILLINGS - BROILERS ONLY) */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Top Month Filter Strip */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Hesabu ya Faida &amp; Hasara Kiotomatiki (Automatic P&amp;L)
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Hesabu inajikokotoa papo hapo baada ya kila mauzo ya kuku wa broiler au kuingiza gharama (Pumba, Medecine, n.k.).
              </p>
            </div>

            {/* Month Filter Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-stone-600 mr-1">Chagua Mwezi:</span>
              <button
                onClick={() => setSelectedPnlMonth('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedPnlMonth === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Miezi Yote (Jumla Kuu)
              </button>
              {allAvailableMonths.map((mKey) => (
                <button
                  key={mKey}
                  onClick={() => setSelectedPnlMonth(mKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedPnlMonth === mKey
                      ? 'bg-amber-400 text-stone-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {formatMonthLabel(mKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick KPI Stat Cards for Active Period */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Mapato ya Kuku ({activeMonthSummary.label}):</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-700 block mt-1">
                {formatTZS(activeMonthSummary.revenue)}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {activeMonthSummary.birdsSold} kuku wa broiler waliouzwa
              </span>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Chakula cha Broiler:</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-stone-900 block mt-1">
                {formatTZS(activeMonthSummary.feedCost)}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">Pellets za kiwandani</span>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">PUMBA &amp; MEDECINE:</span>
              <div className="mt-1 font-mono text-xs space-y-0.5">
                <div className="flex justify-between font-bold text-amber-950">
                  <span>Pumba:</span>
                  <span>{formatTZS(activeMonthSummary.pumbaCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-900">
                  <span>Medecine:</span>
                  <span>{formatTZS(activeMonthSummary.medicineCost)}</span>
                </div>
              </div>
              <span className="text-[10px] text-stone-500 block mt-1">Gharama mahususi za shamba</span>
            </div>

            <div className={`rounded-xl border p-4 shadow-xs ${
              activeMonthSummary.isProfit ? 'bg-emerald-950 text-white border-emerald-900' : 'bg-red-950 text-white border-red-900'
            }`}>
              <span className="text-[11px] font-bold text-amber-300 uppercase block">
                {activeMonthSummary.isProfit ? 'FAIDA HALISI YA MWEZI' : 'HASARA YA MWEZI'}
              </span>
              <span className={`text-xl sm:text-2xl font-mono font-bold block mt-1 ${
                activeMonthSummary.isProfit ? 'text-amber-300' : 'text-red-300'
              }`}>
                {activeMonthSummary.isProfit ? '+' : '-'} {formatTZS(Math.abs(activeMonthSummary.netProfit))}
              </span>
              <span className="text-[10px] text-stone-300 mt-1 block truncate">
                {activeMonthSummary.isProfit ? 'Uendeshaji una faida nzuri' : 'Gharama za awali za kuku'}
              </span>
            </div>
          </div>

          {/* Formal P&L Statement Box */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Ripoti ya Faida au Hasara (Profit &amp; Loss Statement)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-stone-900 border border-amber-300">
                    {activeMonthSummary.label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Blessed Poultry Tanzania · Hesabu ya kujiendesha ya kuku wa nyama (Broilers), vifaranga, chakula, pumba, dawa na mauzo.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chapisha (Print Statement)</span>
              </button>
            </div>

            {/* Income Section (BROILERS ONLY - NO EGGS) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center justify-between">
                <span>1. Mapato ya Mauzo ya Kuku wa Broiler (Gross Broiler Revenue)</span>
                <span className="font-mono text-emerald-800">{activeMonthSummary.birdsSold} kuku</span>
              </h4>
              <div className="divide-y divide-stone-100 text-xs">
                {(() => {
                  const mSales = selectedPnlMonth === 'all' 
                    ? sales 
                    : sales.filter((s) => getMonthKey(s.date) === selectedPnlMonth);
                  
                  const liveBirdsSold = mSales
                    .filter((s) => s.saleType === 'Live Broilers (Kuku Hai)' || s.saleType === 'Live Birds')
                    .reduce((a, b) => a + (Number(b.quantitySold) || 0), 0);
                  const liveRev = mSales
                    .filter((s) => s.saleType === 'Live Broilers (Kuku Hai)' || s.saleType === 'Live Birds')
                    .reduce((a, b) => a + getSaleRevenue(b), 0);

                  const dressedSold = mSales
                    .filter((s) => s.saleType === 'Dressed / Slaughtered Meat (Nyama)' || s.saleType === 'Dressed / Slaughtered Meat' || s.saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)')
                    .reduce((a, b) => a + (Number(b.quantitySold) || 0), 0);
                  const dressedRev = mSales
                    .filter((s) => s.saleType === 'Dressed / Slaughtered Meat (Nyama)' || s.saleType === 'Dressed / Slaughtered Meat' || s.saleType === 'Broiler Cut-ups / Fillets (Nyama ya Vipande)')
                    .reduce((a, b) => a + getSaleRevenue(b), 0);

                  const manureRev = mSales
                    .filter((s) => s.saleType.includes('Mbolea') || s.saleType.includes('Manure'))
                    .reduce((a, b) => a + getSaleRevenue(b), 0);

                  return (
                    <>
                      <div className="py-2 flex justify-between">
                        <span className="text-stone-700">Mauzo ya Kuku Hai wa Broiler (Live Broilers - {liveBirdsSold} kuku):</span>
                        <span className="font-mono font-bold text-stone-900">{formatTZS(liveRev)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-stone-700">Mauzo ya Kuku Waliochinjwa (Dressed Meat - {dressedSold} kuku):</span>
                        <span className="font-mono font-bold text-stone-900">{formatTZS(dressedRev)}</span>
                      </div>
                      {manureRev > 0 && (
                        <div className="py-2 flex justify-between">
                          <span className="text-stone-700">Mauzo ya Mbolea ya Kuku (Manure):</span>
                          <span className="font-mono font-bold text-stone-900">{formatTZS(manureRev)}</span>
                        </div>
                      )}
                    </>
                  );
                })()}

                <div className="py-2.5 flex justify-between font-bold text-sm bg-stone-50 px-3 rounded-lg">
                  <span className="text-emerald-950">JUMLA YA MAPATO YA MAUZO YA BROILER:</span>
                  <span className="font-mono text-emerald-900">
                    {formatTZS(activeMonthSummary.revenue)}
                  </span>
                </div>

                {/* Cash Flow vs Customer Debt (Kuku Waliopelekwa Wasiozalipwa) */}
                {(() => {
                  const mSales = selectedPnlMonth === 'all' 
                    ? sales 
                    : sales.filter((s) => getMonthKey(s.date) === selectedPnlMonth);
                  
                  const cashCollected = mSales.reduce((sum, s) => {
                    if (s.amountPaidTZS !== undefined) return sum + (Number(s.amountPaidTZS) || 0);
                    if (s.paymentStatus === 'Unpaid / Pending Payment') return sum;
                    return sum + getSaleRevenue(s);
                  }, 0);

                  const debtReceivable = mSales.reduce((sum, s) => {
                    if (s.amountDueTZS !== undefined) return sum + (Number(s.amountDueTZS) || 0);
                    if (s.paymentStatus === 'Unpaid / Pending Payment') return sum + getSaleRevenue(s);
                    return sum;
                  }, 0);

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 uppercase font-bold block">Pesa Zilizolipwa Taslimu / M-Pesa:</span>
                        <span className="font-mono font-bold text-emerald-900 text-sm">{formatTZS(cashCollected)}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                        <span className="text-[10px] text-red-800 uppercase font-bold block">Kuku Waliopelekwa Wasiozalipwa (Deni):</span>
                        <span className="font-mono font-bold text-red-700 text-sm">{formatTZS(debtReceivable)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 bg-red-50 px-3 py-1.5 rounded-lg">
                2. Gharama za Uzalishaji (Operating Expenses &amp; Broiler Purchases)
              </h4>
              <div className="divide-y divide-stone-100 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-stone-700">Kununua Vifaranga vya Broiler (Day-old Chicks):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatTZS(activeMonthSummary.chickCost)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-stone-700">Chakula cha Broiler cha Kiwandani (Starter / Finisher):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatTZS(activeMonthSummary.feedCost)}
                  </span>
                </div>
                <div className="py-2 flex justify-between bg-amber-50/70 px-2 rounded">
                  <span className="text-stone-800 font-semibold">Gharama ya PUMBA (Mahindi / Mpunga):</span>
                  <span className="font-mono font-bold text-amber-900">
                    {formatTZS(activeMonthSummary.pumbaCost)}
                  </span>
                </div>
                <div className="py-2 flex justify-between bg-blue-50/70 px-2 rounded">
                  <span className="text-stone-800 font-semibold">Gharama ya MEDECINE &amp; Vitamini vya Broiler:</span>
                  <span className="font-mono font-bold text-blue-900">
                    {formatTZS(activeMonthSummary.medicineCost)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-stone-700">Chanjo (Vaccines &amp; Dawa za Maji - Gumboro, Newcastle):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatTZS(activeMonthSummary.vaccineCost)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-stone-700">Uendeshaji Mwingine (Maranda ya Mbao, Mkaa/Taa za Joto, Mishahara):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatTZS(activeMonthSummary.otherCost)}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between font-bold text-sm bg-stone-50 px-3 rounded-lg">
                  <span className="text-red-950">JUMLA YA GHARAMA ZA MWEZI (TOTAL EXPENSES):</span>
                  <span className="font-mono text-red-900">
                    {formatTZS(activeMonthSummary.totalExpenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Net Line */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              activeMonthSummary.isProfit ? 'bg-emerald-950 text-white border-emerald-900' : 'bg-red-950 text-white border-red-900'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                  Matokeo ya Kifedha · {activeMonthSummary.label}
                </span>
                <span className="text-lg font-serif font-bold">
                  {activeMonthSummary.isProfit ? 'FAIDA ILIYOPATIKANA (NET PROFIT)' : 'HASARA / UPUNGUFU (NET DEFICIT)'}
                </span>
                <p className="text-xs text-stone-300 mt-0.5">
                  {activeMonthSummary.isProfit
                    ? 'Hongera! Mauzo ya kuku wa broiler yanazidi gharama zote za ununuzi, chakula, pumba, dawa na uendeshaji.'
                    : 'Gharama za ununuzi wa vifaranga na chakula cha awali zinazidi mauzo ya sasa. Kuku wakikua na kuuzwa faida itaongezeka.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                  activeMonthSummary.isProfit ? 'text-amber-300' : 'text-red-300'
                }`}>
                  {activeMonthSummary.isProfit ? '+' : '-'} {formatTZS(Math.abs(activeMonthSummary.netProfit))}
                </span>
              </div>
            </div>
          </div>

          {/* JEDWALI LA ULINGANIFU WA KILA MWEZI (MONTH-BY-MONTH EXPENSES & P&L COMPARISON TABLE) */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Jedwali la Ulinganifu wa Faida na Gharama kwa Kila Mwezi (Month-by-Month Statement)
                </h3>
                <p className="text-xs text-stone-500">
                  Gharama za kila mwezi zikijumuisha Vifaranga, Chakula, Pumba, Medecine, Chanjo, Mauzo na Faida Halisi.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Mwezi</th>
                    <th className="py-3 px-3 text-right">Kuku Waliouzwa</th>
                    <th className="py-3 px-3 text-right">Mauzo (Mapato)</th>
                    <th className="py-3 px-3 text-right">Vifaranga</th>
                    <th className="py-3 px-3 text-right">Chakula</th>
                    <th className="py-3 px-3 text-right text-amber-900 bg-amber-50/60">PUMBA</th>
                    <th className="py-3 px-3 text-right text-blue-900 bg-blue-50/60">MEDECINE</th>
                    <th className="py-3 px-3 text-right">Chanjo &amp; Nyingine</th>
                    <th className="py-3 px-3 text-right font-bold text-red-950">Jumla Matumizi</th>
                    <th className="py-3 px-3 text-right font-bold">Faida/Hasara Halisi</th>
                    <th className="py-3 px-3 text-center">Hali</th>
                    <th className="py-3 px-3 text-center">Hatua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {monthlyFinancialBreakdown.map((m) => (
                    <tr
                      key={m.monthKey}
                      className={`hover:bg-stone-50 transition cursor-pointer ${
                        selectedPnlMonth === m.monthKey ? 'bg-amber-50/40 font-semibold' : ''
                      }`}
                      onClick={() => setSelectedPnlMonth(m.monthKey)}
                    >
                      <td className="py-3 px-3 font-bold text-stone-900 whitespace-nowrap">
                        {m.monthName}
                      </td>
                      <td className="py-3 px-3 font-mono text-right font-bold text-stone-800">
                        {m.birdsSold} kuku
                      </td>
                      <td className="py-3 px-3 font-mono text-right font-bold text-emerald-800">
                        {formatTZS(m.salesRevenue)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-stone-600">
                        {formatTZS(m.chickCost)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-stone-600">
                        {formatTZS(m.feedCost)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right font-bold text-amber-900 bg-amber-50/40">
                        {formatTZS(m.pumbaCost)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right font-bold text-blue-900 bg-blue-50/40">
                        {formatTZS(m.medicineCost)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-stone-600">
                        {formatTZS(m.vaccineCost + m.otherOverheadsCost)}
                      </td>
                      <td className="py-3 px-3 font-mono text-right font-bold text-red-900">
                        {formatTZS(m.totalExpenses)}
                      </td>
                      <td className={`py-3 px-3 font-mono text-right font-bold text-sm ${
                        m.isProfit ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {m.isProfit ? '+' : '-'}{formatTZS(Math.abs(m.netProfitLoss))}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.isProfit
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-red-100 text-red-900 border border-red-300'
                        }`}>
                          {m.isProfit ? 'Faida Nzuri' : 'Upungufu wa Awali'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPnlMonth(m.monthKey);
                          }}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition cursor-pointer"
                        >
                          Tazama
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Summary Row */}
                <tfoot className="bg-stone-100 font-bold border-t-2 border-stone-300 text-stone-900">
                  <tr>
                    <td className="py-3 px-3 uppercase text-[11px]">Jumla Kuu (Total All Months):</td>
                    <td className="py-3 px-3 font-mono text-right">
                      {monthlyFinancialBreakdown.reduce((sum, m) => sum + m.birdsSold, 0)} kuku
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-emerald-800">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.salesRevenue, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.chickCost, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.feedCost, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-amber-950 bg-amber-100/50">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.pumbaCost, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-blue-950 bg-blue-100/50">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.medicineCost, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.vaccineCost + m.otherOverheadsCost, 0))}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-red-950">
                      {formatTZS(monthlyFinancialBreakdown.reduce((sum, m) => sum + m.totalExpenses, 0))}
                    </td>
                    <td className={`py-3 px-3 font-mono text-right text-sm ${
                      financialSummary.isProfit ? 'text-emerald-800' : 'text-red-700'
                    }`}>
                      {financialSummary.isProfit ? '+' : '-'}{formatTZS(Math.abs(financialSummary.netProfitLossTZS))}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] text-stone-500 uppercase">Jumla ya Shamba</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedPnlMonth('all')}
                        className="px-2 py-1 rounded bg-stone-900 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Wote
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW CHICKEN BATCH */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Ingiza Kuku Wapya (New Chicken Entry)</h3>
                <p className="text-xs text-stone-500">Tarehe ya kuingia, bei ya kununua kifaranga (TZS) na idadi.</p>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              {/* Delivery Status Selector: Farm vs Interchick Awaiting Delivery */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hali ya Kuwasili kwa Vifaranga (Chick Delivery Status) *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDeliveryStatus('Delivered to Farm')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                      newDeliveryStatus === 'Delivered to Farm'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 text-emerald-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">🟢</span>
                    <div>
                      <div className="font-bold text-xs">Vimeshafika Shambani</div>
                      <div className="text-[10px] text-stone-500 font-normal">Wamo bandani tayari</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewDeliveryStatus('Ordered & Paid (Awaiting Delivery)');
                      if (!newSupplier) setNewSupplier('Interchick Tanzania (Dar es Salaam Hatchery)');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                      newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300 text-amber-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">🐣</span>
                    <div>
                      <div className="font-bold text-xs">Vimelipwa Interchick</div>
                      <div className="text-[10px] text-amber-800 font-normal">Bado kufika shambani</div>
                    </div>
                  </button>
                </div>
              </div>

              {newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)' && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <span>🐣</span>
                    <span>Taarifa za Oda ya Vifaranga Kutoka Interchick (Supplier):</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Gharama ya vifaranga hivi italipwa na kuhesabiwa kwenye matumizi ya shamba, lakini <strong className="text-amber-950">havitahesabiwa kwenye kuku waliopo bandani</strong> mpaka siku vitakapowasili shambani.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-0.5 text-[11px]">Namba ya Risiti / Oda Ref ya Interchick</label>
                      <input
                        type="text"
                        placeholder="Mfano: INTERCHICK-ORD-9942"
                        value={newHatcheryOrderRef}
                        onChange={(e) => setNewHatcheryOrderRef(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-0.5 text-[11px]">Tarehe Inayotarajiwa Kufika Shambani</label>
                      <input
                        type="date"
                        value={newExpectedDeliveryDate}
                        onChange={(e) => setNewExpectedDeliveryDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Jina la Batch / Banda *</label>
                <input
                  type="text"
                  required
                  placeholder={newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)' ? "Mfano: Batch #04 - Interchick Cobb 500 (Oda Iliyolipwa)" : "Mfano: Batch #04 - Cobb 500 Broilers"}
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Aina ya Kuku wa Broiler (Breed) *</label>
                  <select
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-bold"
                  >
                    <option value="Cobb 500 Broiler">🐓 Cobb 500 Broiler (Kuku wa Nyama)</option>
                    <option value="Ross 308 Broiler">🐓 Ross 308 Broiler (Kuku wa Nyama)</option>
                    <option value="Hubbard Broiler">🐓 Hubbard Broiler</option>
                    <option value="Commercial Broiler">🐓 Commercial Broiler</option>
                    <option value="Kuroiler (Meat)">🐓 Kuroiler (Kuku wa Nyama)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)' ? 'Tarehe ya Malipo / Oda Interchick *' : 'Tarehe ya Kuingia Shambani *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newEntryDate}
                    onChange={(e) => setNewEntryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Idadi ya Vifaranga (Quantity) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-500">Mfano: 500 au 700 vifaranga</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bei ya Kifaranga cha Siku 1 (TZS) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={newPricePerBirdTZS}
                    onChange={(e) => setNewPricePerBirdTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-stone-500">Bei ya Interchick: ~2,200 TZS</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex justify-between font-bold">
                <span className="text-amber-900">
                  {newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)' ? 'Jumla ya Malipo ya Mapema (Advance Paid to Interchick):' : 'Jumla ya Gharama ya Manunuzi:'}
                </span>
                <span className="font-mono text-stone-900 text-sm">
                  {formatTZS((Number(newQuantity) || 0) * (Number(newPricePerBirdTZS) || 0))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Lengo la Bei ya Kuuza Baada ya Kukuza (TZS)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={newTargetPriceTZS}
                    onChange={(e) => setNewTargetPriceTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-stone-500">Mfano: 11,000 au 11,500 TZS</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mzalishaji / Hatchery (Supplier)</label>
                  <input
                    type="text"
                    placeholder="Mfano: Interchick Tanzania, Silverlands"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Maelezo ya Ziada</label>
                <textarea
                  rows={2}
                  placeholder="Maelezo kuhusu maandalizi ya banda, joto, au namba ya simu ya Interchick..."
                  value={newBatchNotes}
                  onChange={(e) => setNewBatchNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl cursor-pointer"
                >
                  {newDeliveryStatus === 'Ordered & Paid (Awaiting Delivery)' ? 'Hifadhi Oda ya Interchick' : 'Hifadhi Batch ya Shambani'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD VACCINATION */}
      {showVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Ratiba ya Chanjo (Vaccination Entry)</h3>
                <p className="text-xs text-stone-500">Weka ratiba ya chanjo kuzuia magonjwa ya kuku.</p>
              </div>
              <button onClick={() => setShowVaccineModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVaccine} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Chagua Batch ya Kuku *</label>
                <select
                  value={vacBatchId}
                  onChange={(e) => setVacBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} ({b.currentQuantity} kuku)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Jina la Chanjo *</label>
                  <select
                    value={vacName}
                    onChange={(e) => setVacName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Gumboro (IBD) Dose 1">Gumboro (IBD) Dose ya Kwanza</option>
                    <option value="Gumboro 2nd Dose (Booster)">Gumboro Dose ya Pili (Booster)</option>
                    <option value="Newcastle / Mdondo (Lasota)">Newcastle / Mdondo (Lasota)</option>
                    <option value="Newcastle + IB">Newcastle + IB</option>
                    <option value="Ndui ya Kuku (Fowl Pox)">Ndui ya Kuku (Fowl Pox)</option>
                    <option value="Dawa ya Minyoo (Dewormer)">Dawa ya Minyoo (Dewormer)</option>
                    <option value="Marek's Vaccine">Marek's Vaccine</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarehe ya Chanjo *</label>
                  <input
                    type="date"
                    required
                    value={vacTargetDate}
                    onChange={(e) => setVacTargetDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Njia ya Kutoa (Route) *</label>
                  <select
                    value={vacRoute}
                    onChange={(e) => setVacRoute(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Drinking Water">Maji ya Kunywa (Drinking Water)</option>
                    <option value="Eye Drop">Tone la Jicho (Eye Drop)</option>
                    <option value="Wing Web">Kuchoma Kwenye Bawa (Wing Web)</option>
                    <option value="Subcutaneous Injection">Sindano Chini ya Ngozi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gharama ya Chanjo (TZS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={vacCostTZS}
                    onChange={(e) => setVacCostTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mtoa Chanjo (Administered By)</label>
                <input
                  type="text"
                  value={vacAdminBy}
                  onChange={(e) => setVacAdminBy(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVaccineModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Hifadhi Chanjo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD FEED */}
      {showFeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Rekodi Chakula Kilicholiwa</h3>
                <p className="text-xs text-stone-500">Uzito kwa kilo, aina ya chakula, na gharama zake.</p>
              </div>
              <button onClick={() => setShowFeedModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFeed} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Chagua Batch *</label>
                <select
                  value={feedBatchId}
                  onChange={(e) => setFeedBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} ({b.currentQuantity} kuku)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Aina ya Chakula *</label>
                  <select
                    value={feedType}
                    onChange={(e) => setFeedType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Broiler Starter">Broiler Starter</option>
                    <option value="Broiler Finisher">Broiler Finisher</option>
                    <option value="Chick Starter">Chick Starter</option>
                    <option value="Growers Mash">Growers Mash</option>
                    <option value="Layers Mash">Layers Mash</option>
                    <option value="Kienyeji Mash">Kienyeji Mash</option>
                    <option value="Pumba (Mahindi / Mpunga)">Pumba (Mahindi / Mpunga)</option>
                    <option value="Grains / Sunflower Meal">Mahindi / Mashudu ya Alizeti</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarehe *</label>
                  <input
                    type="date"
                    required
                    value={feedDate}
                    onChange={(e) => setFeedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kiasi Kilicholiwa (Kg) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={feedKg}
                    onChange={(e) => setFeedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bei kwa Kilo (TZS) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={feedCostPerKgTZS}
                    onChange={(e) => setFeedCostPerKgTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex justify-between font-bold">
                <span className="text-amber-900">Jumla ya Gharama ya Chakula:</span>
                <span className="font-mono text-stone-900">
                  {formatTZS((Number(feedKg) || 0) * (Number(feedCostPerKgTZS) || 0))}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Chapa au Chanzo (Brand)</label>
                <input
                  type="text"
                  placeholder="Mfano: Interchick, Silverlands, Tanfeeds, Kinu cha karibu"
                  value={feedBrand}
                  onChange={(e) => setFeedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeedModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl cursor-pointer"
                >
                  Hifadhi Chakula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD MORTALITY */}
      {showMortalityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Rekodi Vifo vya Kuku (Mortality)</h3>
                <p className="text-xs text-stone-500">Idadi itapunguzwa moja kwa moja kwenye idadi ya kuku waliopo hai.</p>
              </div>
              <button onClick={() => setShowMortalityModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMortality} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Chagua Batch ya Kuku *</label>
                <select
                  value={mortBatchId}
                  onChange={(e) => setMortBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} ({b.currentQuantity} kuku walio hai)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Idadi ya Kuku Waliokufa *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={mortCount}
                    onChange={(e) => setMortCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-red-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarehe ya Kifo *</label>
                  <input
                    type="date"
                    required
                    value={mortDate}
                    onChange={(e) => setMortDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Sababu Inayohisiwa (Suspected Cause) *</label>
                <select
                  value={mortCause}
                  onChange={(e) => setMortCause(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  <option value="Heat stress">Joto kali (Heat stress)</option>
                  <option value="Cold/Chilling">Baridi kali (Cold / Chilling)</option>
                  <option value="Suspected Coccidiosis">Kuhara damu (Coccidiosis)</option>
                  <option value="Respiratory / Mafua">Mafua / Matatizo ya kupumua (Respiratory)</option>
                  <option value="Predator/Injury">Kuumizwa / Kushambuliwa na wanyama</option>
                  <option value="Unknown">Haijafahamika (Unknown)</option>
                  <option value="Other">Nyingine</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hatua Zilizochukuliwa *</label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Kutenga kuku wagonjwa, kuweka dawa au vitamini kwenye maji"
                  value={mortAction}
                  onChange={(e) => setMortAction(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMortalityModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Hifadhi Vifo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD OTHER EXPENSE (PUMBA, MEDECINE, WOOD SHAVINGS, LABOUR, ETC.) */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Rekodi Gharama za Shamba (Other Expenses)</h3>
                <p className="text-xs text-stone-500">Pumba, Medecine, maranda, mkaa, umeme, mishahara, n.k.</p>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kundi la Gharama (Category) *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-bold text-stone-900"
                >
                  <option value="Pumba (Pumba ya Mahindi / Mpunga)">🌾 PUMBA (Pumba ya Mahindi / Mpunga)</option>
                  <option value="Medecine & Dawa (Antibiotics, Vitamins, Dewormers)">💊 MEDECINE &amp; Dawa (Antibiotics, Vitamini, Minyoo)</option>
                  <option value="Bedding & Wood Shavings / Maranda">🪵 Maranda ya Sakafu (Wood Shavings)</option>
                  <option value="Electricity & Heating/Brooding (Mkaa / Gesi)">🔥 Joto la Vifaranga (Mkaa, Taa za Joto, Umeme)</option>
                  <option value="Water & Hygiene (Virkon S)">🧼 Usafi &amp; Dawa ya Maji (Virkon S, Chlorine)</option>
                  <option value="Labor & Farm Staff (Mshahara)">👷 Mishahara na Posho za Wafanyakazi</option>
                  <option value="Feed & Supplements">🌾 Chakula Kingine &amp; Virutubisho</option>
                  <option value="Vaccines & Veterinary">💉 Huduma ya Daktari wa Mifugo</option>
                  <option value="Equipment & Feeders">🥣 Vyombo vya Chakula na Maji</option>
                  <option value="Transport & Crates">🚚 Usafirishaji na Makreti</option>
                  <option value="Other">Gharama Nyingine</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Maelezo ya Gharama *</label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Pumba ya Mahindi magunia 4 au Dawa ya Coccidiosis"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kiasi Kilicholipwa (TZS) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="500"
                    value={expAmountTZS}
                    onChange={(e) => setExpAmountTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarehe ya Malipo *</label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mlipwaji (Paid To)</label>
                  <input
                    type="text"
                    placeholder="Mfano: Kinu cha Mahindi, Agrovet, Duka la Mbao"
                    value={expPaidTo}
                    onChange={(e) => setExpPaidTo(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Njia ya Malipo *</label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Vodacom M-Pesa">Vodacom M-Pesa (Tanzania)</option>
                    <option value="Tigo Pesa">Tigo Pesa</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Halopesa">Halopesa</option>
                    <option value="CRDB / NMB Bank">Benki (CRDB / NMB)</option>
                    <option value="Cash">Pesa Taslimu (Cash)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Kuhusisha na Batch (Hiari)</label>
                  <select
                    value={expBatchId}
                    onChange={(e) => setExpBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="">Shamba Zima (General Farm)</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Namba ya Risiti / Kumbukumbu</label>
                  <input
                    type="text"
                    placeholder="Mfano: VODA-TX-991 au REC-402"
                    value={expReceipt}
                    onChange={(e) => setExpReceipt(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Hifadhi Gharama
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD SALE (BROILERS ONLY - NO EGGS) */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Rekodi Mauzo ya Kuku wa Broiler</h3>
                <p className="text-xs text-stone-500">Kuku hai wa broiler au nyama ya kuku waliochinjwa (Dressed Meat) - TSh.</p>
              </div>
              <button onClick={() => setShowSaleModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Chagua Batch ya Broiler *</label>
                <select
                  value={saleBatchId}
                  onChange={(e) => setSaleBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-semibold"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} ({b.currentQuantity} kuku walio hai)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Aina ya Mauzo ya Broiler *</label>
                  <select
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-bold text-emerald-950"
                  >
                    <option value="Live Broilers (Kuku Hai)">🐓 Kuku Hai wa Broiler (Live Broilers)</option>
                    <option value="Dressed / Slaughtered Meat (Nyama)">🍗 Kuku Waliochinjwa / Nyama (Dressed Meat)</option>
                    <option value="Broiler Cut-ups / Fillets (Nyama ya Vipande)">🥩 Nyama ya Vipande (Cut-ups / Wings)</option>
                    <option value="Manure (Mbolea ya Banda)">🌱 Mbolea ya Kuku (Manure)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarehe ya Mauzo *</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Idadi ya Kuku Waliouzwa *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={saleQty}
                    onChange={(e) => setSaleQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-stone-900 font-bold"
                  />
                  <span className="text-[10px] text-stone-500">
                    {saleType.includes('Mbolea') ? 'Idadi ya mifuko' : 'Idadi ya kuku (itapungua bandani kiotomatiki)'}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bei kwa Kuku / Kizio (TZS) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    value={saleUnitPriceTZS}
                    onChange={(e) => setSaleUnitPriceTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-emerald-800 font-bold"
                  />
                  <span className="text-[10px] text-stone-500">Mfano: 11,000 TZS au 12,500 TZS</span>
                </div>
              </div>

              {/* Real-Time Automated P&L Calculation Preview */}
              {(() => {
                const curRev = (Number(saleQty) || 0) * (Number(saleUnitPriceTZS) || 0);
                const curNet = financialSummary.netProfitLossTZS;
                const newNet = curNet + curRev;
                const isNewProfit = newNet >= 0;
                return (
                  <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        Hesabu ya Kiotomatiki ya Faida (Auto P&amp;L Preview):
                      </span>
                      <span className="font-mono text-emerald-900 font-bold text-sm">
                        +{formatTZS(curRev)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-600">
                      <span>Faida Halisi ya Sasa ya Shamba:</span>
                      <span className="font-mono font-semibold">
                        {financialSummary.isProfit ? '+' : '-'}{formatTZS(Math.abs(curNet))}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-950 font-bold border-t border-emerald-200 pt-1.5">
                      <span>Faida Halisi Baada ya Mauzo Haya:</span>
                      <span className="font-mono text-emerald-800 text-sm">
                        {isNewProfit ? '+' : '-'}{formatTZS(Math.abs(newNet))}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Customer Payment Status Selector (Kuku Waliopelekwa Wasiozalipwa) */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="block font-semibold text-stone-800 text-xs">
                  Hali ya Malipo ya Mauzo (Payment &amp; Delivery Status) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSalePaymentStatus('Paid');
                      setSaleMethod('Vodacom M-Pesa');
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition flex items-center gap-2 ${
                      salePaymentStatus === 'Paid'
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-sm">🟢</span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold">Imelipwa Kamili</div>
                      <div className="text-[9px] text-stone-500 font-normal">Pesa taslimu / simu</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSalePaymentStatus('Unpaid / Pending Payment');
                      setSaleMethod('Credit / Bado Kulipwa');
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition flex items-center gap-2 ${
                      salePaymentStatus === 'Unpaid / Pending Payment'
                        ? 'bg-red-100 border-red-500 ring-2 ring-red-300 text-red-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-sm">🔴</span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold">Wamepelekwa (Deni)</div>
                      <div className="text-[9px] text-red-700 font-normal">Bado hajalipa kabisa</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSalePaymentStatus('Partial Payment');
                      setSaleMethod('Vodacom M-Pesa');
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition flex items-center gap-2 ${
                      salePaymentStatus === 'Partial Payment'
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 text-amber-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-sm">🟡</span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold">Imelipwa Nusu</div>
                      <div className="text-[9px] text-amber-800 font-normal">Kiasi kinadaiwa</div>
                    </div>
                  </button>
                </div>

                {salePaymentStatus === 'Unpaid / Pending Payment' && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Kuku wataondolewa bandani lakini pesa itarekodiwa kama Deni la Mteja:</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-mono">
                      <span>Kiasi Kinachodaiwa:</span>
                      <strong className="text-red-700 text-sm">
                        {formatTZS((Number(saleQty) || 0) * (Number(saleUnitPriceTZS) || 0))}
                      </strong>
                    </div>
                    <div className="pt-1">
                      <label className="block font-semibold text-stone-700 mb-0.5 text-[10px]">Tarehe ya Ahadi ya Kulipa Deni</label>
                      <input
                        type="date"
                        value={saleDueDate}
                        onChange={(e) => setSaleDueDate(e.target.value)}
                        className="w-full px-2 py-1 border border-stone-300 rounded-lg bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {salePaymentStatus === 'Partial Payment' && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] space-y-2">
                    <div className="font-bold text-amber-950">Malipo ya Kiasi (Partial Payment):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-0.5 text-[10px]">Kiasi Kilicholipwa Leo (TZS) *</label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={saleAmountPaidTZS}
                          onChange={(e) => setSaleAmountPaidTZS(Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white font-mono font-bold text-emerald-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-0.5 text-[10px]">Tarehe ya Ahadi ya Baki</label>
                        <input
                          type="date"
                          value={saleDueDate}
                          onChange={(e) => setSaleDueDate(e.target.value)}
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-xs font-mono">
                      <span className="text-stone-600">Baki Inayodaiwa:</span>
                      <strong className="text-red-700 font-bold">
                        {formatTZS(Math.max(0, ((Number(saleQty) || 0) * (Number(saleUnitPriceTZS) || 0)) - (Number(saleAmountPaidTZS) || 0)))}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Jina la Mnunuzi / Mteja</label>
                  <input
                    type="text"
                    placeholder="Mfano: Hoteli ya Mikocheni, Mama Asha"
                    value={saleBuyer}
                    onChange={(e) => setSaleBuyer(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Namba ya Simu ya Mnunuzi</label>
                  <input
                    type="text"
                    placeholder="Mfano: 0757 895 896"
                    value={salePhone}
                    onChange={(e) => setSalePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {salePaymentStatus !== 'Unpaid / Pending Payment' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Njia ya Malipo *</label>
                    <select
                      value={saleMethod}
                      onChange={(e) => setSaleMethod(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                    >
                      <option value="Vodacom M-Pesa">Vodacom M-Pesa</option>
                      <option value="Tigo Pesa">Tigo Pesa</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="Halopesa">Halopesa</option>
                      <option value="CRDB / NMB Bank">Benki (CRDB / NMB)</option>
                      <option value="Cash">Pesa Taslimu (Cash)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Namba ya Muamala (Ref)</label>
                    <input
                      type="text"
                      placeholder="Mfano: VODA-TX-9983A"
                      value={salePaymentRef}
                      onChange={(e) => setSalePaymentRef(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  {salePaymentStatus === 'Unpaid / Pending Payment' ? 'Hifadhi Mauzo ya Deni' : 'Hifadhi Mauzo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: RECORD PAYMENT FOR UNPAID DELIVERIES (REKODI MALIPO YA MADENI YA KUKU) */}
      {showPayModal && payingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Rekodi Malipo ya Kuku Waliopelekwa (Deni)</span>
                </h3>
                <p className="text-xs text-stone-500">Mteja: <strong className="text-stone-800">{payingSale.buyerName}</strong></p>
              </div>
              <button
                onClick={() => {
                  setShowPayModal(false);
                  setPayingSale(null);
                }}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Kuku wa Broiler Waliopelekwa:</span>
                <span className="font-bold text-stone-900 font-mono">{payingSale.quantitySold} kuku</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jumla ya Thamani ya Mauzo:</span>
                <span className="font-bold text-stone-900 font-mono">{formatTZS(getSaleRevenue(payingSale))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Kiasi Kilicholipwa Kabla:</span>
                <span className="font-bold text-emerald-800 font-mono">{formatTZS(payingSale.amountPaidTZS || 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-stone-200 pt-1.5">
                <span className="text-red-800">Deni Linalodaiwa Sasa:</span>
                <span className="font-mono text-red-700">
                  {formatTZS(payingSale.amountDueTZS !== undefined ? payingSale.amountDueTZS : Math.max(0, getSaleRevenue(payingSale) - (payingSale.amountPaidTZS || 0)))}
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordSalePayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kiasi Kinacholipwa Sasa (TZS) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={payingSale.amountDueTZS !== undefined ? payingSale.amountDueTZS : getSaleRevenue(payingSale)}
                  step="500"
                  value={payAmountTZS}
                  onChange={(e) => setPayAmountTZS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-base font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Njia ya Malipo *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-medium"
                >
                  <option value="Vodacom M-Pesa">Vodacom M-Pesa</option>
                  <option value="Tigo Pesa">Tigo Pesa</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Halopesa">Halopesa</option>
                  <option value="CRDB / NMB Bank">Benki (CRDB / NMB)</option>
                  <option value="Cash">Pesa Taslimu (Cash)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Namba ya Muamala / Risiti (Ref)</label>
                <input
                  type="text"
                  placeholder="Mfano: VODA-TX-99321 au CSH-102"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayModal(false);
                    setPayingSale(null);
                  }}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Hifadhi Malipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
