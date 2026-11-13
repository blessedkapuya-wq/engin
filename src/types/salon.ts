export type AttendanceStatus = 'Present' | 'Off' | 'Leave' | 'Absent';
export type TargetAchievement = 'Yes' | 'No' | 'Partly';
export type PerformanceRating = 'Excellent' | 'Good' | 'Needs improvement' | '';

export interface AttendanceRow {
  day: string;
  date: string;
  status: AttendanceStatus;
  timeIn: string;
  timeOut: string;
  hours: number | string;
  initials: string;
}

export interface DutyRow {
  day: string;
  tasksCompleted: string;
  pendingFollowUp: string;
}

export interface ClientServiceRow {
  day: string;
  clientsAttended: number | string;
  servicesPerformed: string;
  followUpNeeded: string;
}

export interface MarketingRow {
  day: string;
  activity: string;
  platform: string;
  timeSpent: string;
  result: string;
}

export interface TargetRow {
  target: string;
  achieved: TargetAchievement;
  reason: string;
}

export interface StaffReport {
  id: string;
  staffName: string;
  position: string;
  weekCommencing: string;
  submissionDate: string;
  staffSignature: string;
  staffSignatureDate: string;

  // 1. Attendance
  attendance: AttendanceRow[];
  attendanceNotes: string;

  // 2. Daily Duties
  dailyDuties: DutyRow[];

  // 3. Clients and Services
  clientServices: ClientServiceRow[];
  serviceSalesTotal: number;
  productSalesTotal: number;
  otherSalesTotal: number;
  weeklyTotal: number;
  productsSold: string;

  // 4. Marketing
  marketingActivities: MarketingRow[];

  // 5. Customer Experience & Improvement
  positiveFeedback: string;
  complaintsHandled: string;
  challenges: string;
  supportNeeded: string;

  // 6. Targets
  targets: TargetRow[];
  nextWeekPriorities: string;

  // 7. Owner/Supervisor Review
  reviewerComments: string;
  performanceRating: PerformanceRating;
  actionPoints: string;
  reviewerName: string;
  reviewerSignature: string;
  reviewDate: string;
  isReviewed: boolean;
}

export interface SalonService {
  id: string;
  name: string;
  category: 'Hair Care' | 'Facials & Skin' | 'Nails & Spa' | 'Body Wellness';
  duration: string;
  priceKSh: number;
  description: string;
  image: string;
}

export interface SalonProduct {
  id: string;
  name: string;
  category: string;
  priceKSh: number;
  volume: string;
  description: string;
  inStock: boolean;
  image: string;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  avatar: string;
  accessPin: string; // 4-digit staff access PIN
  status: 'active' | 'inactive' | 'replaced';
  canRecordSales: boolean;
  canSubmitReports: boolean;
  canRecordExpenses: boolean;
  activeReportsCount: number;
  payType: 'salary' | 'commission' | 'hybrid';
  baseSalaryKSh: number;
  commissionRateServices: number; // e.g. 0.30
  commissionRateProducts: number; // e.g. 0.10
  nssfNumber?: string;
  kraPin?: string;
  dateJoined?: string;
  replacedBy?: string;
  replacementDate?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  size: string;
  priceKSh: number;
  stockQuantity: number;
  reorderLevel: number; // Alert if <= 3
  image?: string;
  isAuthenticPhoto?: boolean;
}

export interface SalonExpense {
  id: string;
  date: string;
  category: 'Rent' | 'Utilities & Power' | 'Salon Supplies & Products' | 'Staff Welfare & Tea' | 'Repairs & Maintenance' | 'Marketing' | 'Other';
  description: string;
  amountKSh: number;
  paidTo: string;
  paymentMethod: 'M-Pesa' | 'Cash' | 'Bank Transfer';
  receiptRef?: string;
}

export interface DailySaleEntry {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone?: string;
  type: 'Service' | 'Product Retail';
  itemName: string;
  staffName: string;
  quantity: number;
  amountKSh: number;
  paymentMethod: 'M-Pesa' | 'Cash';
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  payType: 'salary' | 'commission' | 'hybrid';
  period: string; // e.g. 'Oct 2026'
  serviceSalesKSh: number;
  productSalesKSh: number;
  basePayKSh: number;
  commissionKSh: number;
  grossPayKSh: number;
  // Kenya Statutory Deductions
  payeTaxKSh: number;
  shifKSh: number; // 2.75%
  housingLevyKSh: number; // 1.5%
  nssfKSh: number; // Tier I & II
  totalDeductionsKSh: number;
  netPayoutKSh: number;
  status: 'Pending' | 'Paid' | 'Processing';
  paymentDate?: string;
}

export interface OwnerVaultState {
  totalGrossRevenueKSh: number;
  totalPayrollExpensesKSh: number;
  totalTaxLiabilityKSh: number;
  operatingExpensesKSh: number;
  salonEmergencyReserveKSh: number; // Retained buffer for rent, power, slow periods
  businessGrowthFundKSh: number; // Capital strictly retained for restocking & salon growth
  reinvestmentRate: number; // e.g. 0.40 (40% retained for growth)
  monthlyOwnerSalaryTargetKSh: number; // Target disciplined personal salary (e.g. KSh 70,000)
  totalOwnerDrawnThisMonthKSh: number; // Amount taken for personal use this month
  withdrawableProfitKSh: number; // Disciplined safe amount available for owner personal salary
  withdrawals: OwnerWithdrawal[];
}

export interface OwnerWithdrawal {
  id: string;
  date: string;
  amountKSh: number;
  withdrawalType: 'Owner Monthly Salary' | 'Personal Drawing' | 'Business Reinvestment' | 'Emergency Personal Advance';
  method: 'M-Pesa' | 'Bank Transfer (Equity/KCB)' | 'Cash';
  destinationAccount: string;
  notes: string;
  status: 'Completed' | 'Pending';
}

export interface KenyaTaxSummary {
  period: string;
  turnoverRevenueKSh: number;
  turnoverTaxKSh: number; // 3% of turnover for MSMEs
  payeTotalKSh: number;
  housingLevyTotalKSh: number; // 1.5% employee + 1.5% employer
  shifTotalKSh: number; // 2.75%
  nssfTotalKSh: number;
  totalTaxPayableKSh: number;
  dueDate: string; // 9th or 20th
  prnNumber: string;
}

export interface DailyTillHandover {
  id: string;
  date: string;
  closingTime: string;
  cashierName: string;
  totalSalesCount: number;
  grossSalesKSh: number;
  expectedCashKSh: number;
  actualCashKSh: number;
  cashVarianceKSh: number;
  expectedMpesaKSh: number;
  actualMpesaKSh: number;
  mpesaVarianceKSh: number;
  cashExpensesPaidKSh: number;
  totalExpensesKSh: number;
  status: 'Balanced' | 'Shortfall' | 'Surplus';
  notes?: string;
  submittedAt: string;
  verifiedByOwner?: boolean;
}
