import {
  StaffReport,
  SalonService,
  SalonProduct,
  StaffMember,
  OwnerVaultState,
  InventoryItem,
  SalonExpense,
  DailySaleEntry,
  DailyTillHandover
} from '../types/salon';
import { BAREGLOW_PRODUCTS } from './bareglowCatalog';

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const createEmptyReport = (staffName = '', position = ''): StaffReport => ({
  id: 'rpt-' + Date.now(),
  staffName,
  position,
  weekCommencing: '2026-10-26',
  submissionDate: '2026-11-01',
  staffSignature: staffName,
  staffSignatureDate: '2026-11-01',

  attendance: DAYS_OF_WEEK.map((day, idx) => ({
    day,
    date: `2026-10-${26 + idx}`,
    status: idx === 6 ? 'Off' : 'Present',
    timeIn: idx === 6 ? '' : '08:30 AM',
    timeOut: idx === 6 ? '' : '06:30 PM',
    hours: idx === 6 ? 0 : 9,
    initials: staffName ? staffName.split(' ').map(n => n[0]).join('') : ''
  })),
  attendanceNotes: '',

  dailyDuties: DAYS_OF_WEEK.map((day) => ({
    day,
    tasksCompleted: '',
    pendingFollowUp: ''
  })),

  clientServices: DAYS_OF_WEEK.map((day) => ({
    day,
    clientsAttended: 0,
    servicesPerformed: '',
    followUpNeeded: ''
  })),
  serviceSalesTotal: 0,
  productSalesTotal: 0,
  otherSalesTotal: 0,
  weeklyTotal: 0,
  productsSold: '',

  marketingActivities: DAYS_OF_WEEK.map((day) => ({
    day,
    activity: '',
    platform: '',
    timeSpent: '',
    result: ''
  })),

  positiveFeedback: '',
  complaintsHandled: '',
  challenges: '',
  supportNeeded: '',

  targets: [
    { target: '', achieved: 'Yes', reason: '' },
    { target: '', achieved: 'Yes', reason: '' },
    { target: '', achieved: 'Yes', reason: '' }
  ],
  nextWeekPriorities: '',

  reviewerComments: '',
  performanceRating: '',
  actionPoints: '',
  reviewerName: '',
  reviewerSignature: '',
  reviewDate: '',
  isReviewed: false
});

export const SAMPLE_REPORT: StaffReport = {
  id: 'rpt-bareglow-001',
  staffName: 'Faith Mwangi',
  position: 'Senior Aesthetician & Organic Hair Specialist',
  weekCommencing: '2026-10-26',
  submissionDate: '2026-11-01',
  staffSignature: 'Faith Mwangi',
  staffSignatureDate: '2026-11-01',

  // Section 1: Attendance Record
  attendance: [
    { day: 'Monday', date: '2026-10-26', status: 'Present', timeIn: '08:30 AM', timeOut: '06:30 PM', hours: 9.5, initials: 'FM' },
    { day: 'Tuesday', date: '2026-10-27', status: 'Present', timeIn: '08:25 AM', timeOut: '06:45 PM', hours: 9.5, initials: 'FM' },
    { day: 'Wednesday', date: '2026-10-28', status: 'Present', timeIn: '08:30 AM', timeOut: '06:30 PM', hours: 9.5, initials: 'FM' },
    { day: 'Thursday', date: '2026-10-29', status: 'Present', timeIn: '08:30 AM', timeOut: '07:00 PM', hours: 10.0, initials: 'FM' },
    { day: 'Friday', date: '2026-10-30', status: 'Present', timeIn: '08:15 AM', timeOut: '07:30 PM', hours: 10.5, initials: 'FM' },
    { day: 'Saturday', date: '2026-10-31', status: 'Present', timeIn: '08:00 AM', timeOut: '07:30 PM', hours: 11.0, initials: 'FM' },
    { day: 'Sunday', date: '2026-11-01', status: 'Off', timeIn: '-', timeOut: '-', hours: 0, initials: 'FM' }
  ],
  attendanceNotes: 'Worked an extra 1.5 hours on Friday & Saturday to accommodate weekend bridal glow packages and scheduled scalp treatments. Shift swap with Brian approved by supervisor.',

  // Section 2: Daily Duties & Work Completed
  dailyDuties: [
    { day: 'Monday', tasksCompleted: 'Morning treatment station sanitization; inventory stock take for organic face oils; performed 3 deep botanical hair masks.', pendingFollowUp: 'Restock eucalyptus essential oils by Wednesday.' },
    { day: 'Tuesday', tasksCompleted: 'Completed 4 organic customized facials; calibrated micro-mist hair steamer; conducted 1 bridal skin consultation.', pendingFollowUp: 'Send bridal skin prep checklist to client Wanjiku.' },
    { day: 'Wednesday', tasksCompleted: 'Performed 5 keratin-free silk press & botanical hydration therapies; mixed herbal rinse infusions.', pendingFollowUp: 'Recheck client scalp sensitivity notes for Mrs. Patel.' },
    { day: 'Thursday', tasksCompleted: 'Attended 4 full facial treatments & lymphatic drainage; sanitized facial sponges; assisted junior stylist with root tinting.', pendingFollowUp: 'Book follow-up facial for client Lucy in 3 weeks.' },
    { day: 'Friday', tasksCompleted: 'Full booked day: 6 deluxe treatments (3 Glow Facials, 3 Scalp Detox rituals); managed afternoon appointment queue.', pendingFollowUp: 'Ensure extra clean towels prep for busy Saturday.' },
    { day: 'Saturday', tasksCompleted: 'Prepped 2 bridal parties; conducted 7 specialized services; end-of-week station sterilization and laundry audit.', pendingFollowUp: 'All Saturday client records logged into salon booking ledger.' },
    { day: 'Sunday', tasksCompleted: 'Roster scheduled off-day.', pendingFollowUp: 'None.' }
  ],

  // Section 3: Clients & Services
  clientServices: [
    { day: 'Monday', clientsAttended: 4, servicesPerformed: '2x Organic Hydration Hair Therapy, 2x Herbal Scalp Detox', followUpNeeded: 'Follow-up with client Joy on hair shedding progress' },
    { day: 'Tuesday', clientsAttended: 5, servicesPerformed: '3x Bareglow Signature Radiance Facial, 2x Botanical Blowout', followUpNeeded: 'Send homecare regimen for hyperpigmentation treatment' },
    { day: 'Wednesday', clientsAttended: 6, servicesPerformed: '4x Silk Press with Argan infusion, 2x Vitamin C Boost Facial', followUpNeeded: 'Routine reminder for Mrs. Achieng in 4 weeks' },
    { day: 'Thursday', clientsAttended: 5, servicesPerformed: '3x Customized Botanical Facials, 2x Organic Hair Coloring', followUpNeeded: 'Check color retention test for Mrs. Kamau' },
    { day: 'Friday', clientsAttended: 7, servicesPerformed: '4x Deluxe Glow Facials, 3x Intensive Hair Reconstruction', followUpNeeded: 'Provide serum reorder link to 2 walk-in clients' },
    { day: 'Saturday', clientsAttended: 8, servicesPerformed: '4x Bridal Glow Packages, 4x High-Gloss Scalp & Style', followUpNeeded: 'Confirm feedback on bridal wedding styling' },
    { day: 'Sunday', clientsAttended: 0, servicesPerformed: 'Off day', followUpNeeded: 'None' }
  ],
  serviceSalesTotal: 124500,
  productSalesTotal: 48200,
  otherSalesTotal: 7500,
  weeklyTotal: 180200,
  productsSold: '• 6x Bareglow Botanical Face Oil (KSh 19,200)\n• 5x Organic Rosemary Hair Serum (KSh 16,000)\n• 4x Restorative Shea Face Cream (KSh 13,000)\n• 3x Wooden Scalp Massager Combs (KSh 7,500 other sales)',

  // Section 4: Marketing Activities & Time Spent
  marketingActivities: [
    { day: 'Monday', activity: 'Created reel showcasing scalp detox steam therapy before/after', platform: 'Instagram Reels', timeSpent: '45 mins', result: '1,840 views, 3 direct booking inquiries' },
    { day: 'Tuesday', activity: 'Shared story post on organic face cream ingredients (squalane & shea)', platform: 'TikTok / IG Story', timeSpent: '30 mins', result: '5 product sales reservations via WhatsApp' },
    { day: 'Wednesday', activity: 'Answered client DMs and hair care consultations', platform: 'WhatsApp Business', timeSpent: '40 mins', result: '4 booked appointments confirmed' },
    { day: 'Thursday', activity: 'Recorded behind-the-scenes organic botanical formulation mix', platform: 'Instagram Feed', timeSpent: '35 mins', result: '42 saves, positive community engagement' },
    { day: 'Friday', activity: 'Weekend bridal glow promotion story broadcast', platform: 'WhatsApp & Instagram', timeSpent: '30 mins', result: 'Filled 2 remaining Saturday afternoon slots' },
    { day: 'Saturday', activity: 'Live clip of salon weekend vibe & soothing tea station', platform: 'Instagram Stories', timeSpent: '20 mins', result: 'High viewer engagement, 12 new followers' },
    { day: 'Sunday', activity: 'Scheduled upcoming week motivational quote & self-care reminder', platform: 'Facebook & Instagram', timeSpent: '25 mins', result: 'Scheduled for Monday 7:30 AM release' }
  ],

  // Section 5: Customer Experience, Challenges & Improvement
  positiveFeedback: 'Clients praised the natural aroma of our organic lavender facial steam and noted their skin felt deeply nourished without any oily residue. Client Grace N. stated her hair hasn’t felt this strong in months.',
  complaintsHandled: 'One client waited 15 minutes due to an earlier treatment running slightly over time. We offered complimentary organic chamomile infusion herbal tea and a complimentary scalp massage during the wash, which left her thoroughly delighted and she tipped generously.',
  challenges: 'High humidity on Friday afternoon slowed down the drying time for organic hair treatments. We adjusted the salon ventilation and steamer temperature settings to maintain optimal service timing.',
  supportNeeded: 'We need to replenish 2 additional bottles of Organic Rosemary Scalp Serum and restock soft organic bamboo facial towels before the upcoming weekend rush.',

  // Section 6: Targets & Next-Week Plan
  targets: [
    { target: 'Achieve weekly individual service revenue of KSh 110,000', achieved: 'Yes', reason: 'Surpassed target! Totalled KSh 124,500 due to strong bridal bookings.' },
    { target: 'Sell at least 12 retail homecare products', achieved: 'Yes', reason: 'Sold 15 units (6 face oils, 5 serums, 4 creams) totaling KSh 48,200.' },
    { target: 'Achieve 100% on-time client appointment start times', achieved: 'Partly', reason: 'Delays occurred on 2 appointments on Friday due to complex hair length, handled smoothly with herbal tea service.' }
  ],
  nextWeekPriorities: '1. Introduce the new Organic Rosehip Hydration Facial protocol to the team.\n2. Partner with reception to boost retail bundle cross-sales (Face Oil + Scalp Serum).\n3. Follow up with Saturday bridal clients for photo testimonials and Google reviews.\n4. Maintain 100% station cleanliness audit score.',

  // Section 7: Owner / Supervisor Review
  reviewerComments: 'Outstanding performance this week Faith! Exceeded both your service and retail revenue goals by over 20%. Customer compliments reflect your commitment to the Bareglow organic philosophy. Great recovery on the appointment delay.',
  performanceRating: 'Excellent',
  actionPoints: '1. Inventory manager will dispatch requested organic serum and bamboo towels by Tuesday.\n2. Scheduled to lead Thursday 30-min internal masterclass on the new Rosehip Facial technique.',
  reviewerName: 'Tinez Kapuya',
  reviewerSignature: 'Tinez Kapuya (Salon Owner & Director)',
  reviewDate: '2026-11-02',
  isReviewed: true
};

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Faith Mwangi',
    position: 'Senior Aesthetician & Hair Specialist',
    email: 'faith@bareglow.co.ke',
    phone: '+254 712 345 678',
    avatar: 'FM',
    accessPin: '1001',
    status: 'active',
    canRecordSales: true,
    canSubmitReports: true,
    canRecordExpenses: true, // Senior staff can record petty supplies
    activeReportsCount: 4,
    payType: 'hybrid',
    baseSalaryKSh: 30000,
    commissionRateServices: 0.15, // 15% on services
    commissionRateProducts: 0.10, // 10% on products
    kraPin: 'A014892301Z',
    nssfNumber: '10482910',
    dateJoined: '2025-01-15',
    notes: 'Senior treatment specialist & assistant manager'
  },
  {
    id: 'st-2',
    name: 'Grace Atieno',
    position: 'Lead Colorist & Natural Hair Stylist',
    email: 'grace@bareglow.co.ke',
    phone: '+254 723 456 789',
    avatar: 'GA',
    accessPin: '1002',
    status: 'active',
    canRecordSales: true,
    canSubmitReports: true,
    canRecordExpenses: false,
    activeReportsCount: 3,
    payType: 'commission',
    baseSalaryKSh: 0,
    commissionRateServices: 0.35, // 35% commission on service sales
    commissionRateProducts: 0.10,
    kraPin: 'A018294719K',
    nssfNumber: '10928374',
    dateJoined: '2025-03-01',
    notes: 'Commission stylist specializing in organic coloring'
  },
  {
    id: 'st-3',
    name: 'Brian Ochieng',
    position: 'Massage Therapist & Spa Specialist',
    email: 'brian@bareglow.co.ke',
    phone: '+254 734 567 890',
    avatar: 'BO',
    accessPin: '1003',
    status: 'active',
    canRecordSales: true,
    canSubmitReports: true,
    canRecordExpenses: false,
    activeReportsCount: 3,
    payType: 'salary',
    baseSalaryKSh: 38000, // Fixed monthly salary
    commissionRateServices: 0,
    commissionRateProducts: 0.05,
    kraPin: 'A015729183P',
    nssfNumber: '10847291',
    dateJoined: '2024-11-10',
    notes: 'Full-time salaried spa therapist'
  },
  {
    id: 'st-4',
    name: 'Sarah Njeri',
    position: 'Junior Nail Artist & Esthetician',
    email: 'sarah@bareglow.co.ke',
    phone: '+254 745 678 901',
    avatar: 'SN',
    accessPin: '1004',
    status: 'active',
    canRecordSales: true,
    canSubmitReports: true,
    canRecordExpenses: false,
    activeReportsCount: 2,
    payType: 'commission',
    baseSalaryKSh: 0,
    commissionRateServices: 0.40, // 40% commission on nail services
    commissionRateProducts: 0.10,
    kraPin: 'A019384726Q',
    nssfNumber: '10738291',
    dateJoined: '2025-06-20',
    notes: 'Nail technician on 40% service commission'
  }
];

export const INITIAL_OWNER_VAULT: OwnerVaultState = {
  totalGrossRevenueKSh: 685000,
  totalPayrollExpensesKSh: 198000,
  totalTaxLiabilityKSh: 42500,
  operatingExpensesKSh: 110000, // Rent, electricity tokens, supplies
  salonEmergencyReserveKSh: 80000, // Retained safety buffer for rent & power
  businessGrowthFundKSh: 134500, // Capital strictly reserved for restocking 80 products & salon growth
  reinvestmentRate: 0.45, // 45% retained for business growth
  monthlyOwnerSalaryTargetKSh: 75000, // Sustainable owner personal salary limit
  totalOwnerDrawnThisMonthKSh: 45000, // What Tinez has already drawn this month
  withdrawableProfitKSh: 75000, // Disciplined safe amount available for owner personal salary
  withdrawals: [
    {
      id: 'wdr-001',
      date: '2026-10-15',
      amountKSh: 45000,
      withdrawalType: 'Owner Monthly Salary',
      method: 'M-Pesa',
      destinationAccount: '+254 796 134 777 (Owner Tinez Kapuya)',
      notes: 'Mid-month personal salary draw',
      status: 'Completed'
    },
    {
      id: 'wdr-002',
      date: '2026-10-01',
      amountKSh: 75000,
      withdrawalType: 'Owner Monthly Salary',
      method: 'Bank Transfer (Equity/KCB)',
      destinationAccount: 'Equity Bank - 012029384719 (Tinez Kapuya)',
      notes: 'September owner personal salary disbursement',
      status: 'Completed'
    }
  ]
};

export const INITIAL_SERVICES: SalonService[] = [
  {
    id: 'srv-1',
    name: 'Bareglow Signature Radiance Facial',
    category: 'Facials & Skin',
    duration: '75 mins',
    priceKSh: 6500,
    description: 'Deep cleansing with cold-pressed botanical oils, gentle AHA exfoliation, herbal steam, lymphatic facial massage, and pure squalane hydration.',
    image: '/src/assets/images/service_facial_treatment_1793681735913.jpg'
  },
  {
    id: 'srv-2',
    name: 'Organic Scalp Detox & Botanical Silk Press',
    category: 'Hair Care',
    duration: '90 mins',
    priceKSh: 8000,
    description: 'Clarifying rosemary & tea tree scalp exfoliation, steam infusion mask, and heat-protective organic silk press without harsh chemicals.',
    image: '/src/assets/images/service_hair_styling_1793681736482.jpg'
  },
  {
    id: 'srv-3',
    name: 'Herbal Hydration Hair Reconstruction',
    category: 'Hair Care',
    duration: '60 mins',
    priceKSh: 5500,
    description: 'Multi-herb infusion with plant keratin and raw shea butter to restore curl pattern, elasticity, and brilliant mirror shine.',
    image: '/src/assets/images/hero_salon_interior_1793681735672.jpg'
  },
  {
    id: 'srv-4',
    name: 'Botanical Manicure & Luxury Pedicure',
    category: 'Nails & Spa',
    duration: '60 mins',
    priceKSh: 4200,
    description: 'Epsom salt & lavender foot soak, organic sugar scrub, non-toxic breathable polish, and warm botanical oil massage.',
    image: '/src/assets/images/product_organic_range_1793681736162.jpg'
  }
];

export const INITIAL_PRODUCTS: SalonProduct[] = [
  {
    id: 'prd-1',
    name: 'Bareglow Botanical Face Oil',
    category: 'Skincare',
    priceKSh: 3200,
    volume: '100ml / 3.4 fl oz',
    description: 'Neroli, Jojoba & Rosehip infusion for lightweight 24-hour hydration and natural radiant glow.',
    inStock: true,
    image: '/src/assets/images/product_organic_range_1793681736162.jpg'
  },
  {
    id: 'prd-2',
    name: 'Organic Rosemary Hair & Scalp Serum',
    category: 'Haircare',
    priceKSh: 3200,
    volume: '100ml / 3.4 fl oz',
    description: 'Stimulating argan and rosemary extract that fortifies follicles, stops breakage, and soothes dry scalps.',
    inStock: true,
    image: '/src/assets/images/product_organic_range_1793681736162.jpg'
  },
  {
    id: 'prd-3',
    name: 'Restorative Shea & Squalane Face Cream',
    category: 'Skincare',
    priceKSh: 3250,
    volume: '100ml / 3.4 fl oz',
    description: 'Whipped organic shea butter and plant squalane deeply locks in moisture and repairs the skin barrier.',
    inStock: true,
    image: '/src/assets/images/product_organic_range_1793681736162.jpg'
  }
];

// Initial stock inventory for all 80 Bareglow products with specific low stock levels (< 3)
export const INITIAL_INVENTORY: InventoryItem[] = BAREGLOW_PRODUCTS.map((p, idx) => {
  // Deliberately set a few items below 3 to demonstrate the requested stock alert!
  let stock = 8 + (idx % 11);
  if (p.id === 'p-59') stock = 2; // Oshaprapra body scrub (300g) - CRITICAL ALERT (< 3)
  if (p.id === 'p-11') stock = 1; // Moroccan black molato soap - CRITICAL ALERT (< 3)
  if (p.id === 'p-43') stock = 2; // Retinol moisturizer - CRITICAL ALERT (< 3)
  if (p.id === 'p-71') stock = 3; // Chebe maxi hair growth - AT REORDER LEVEL (<= 3)
  if (p.id === 'p-37') stock = 0; // Egyptian oil - OUT OF STOCK

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    size: p.size,
    priceKSh: p.priceKSh,
    stockQuantity: stock,
    reorderLevel: 3, // Alert if <= 3
    image: p.image || '/src/assets/images/product_organic_range_1793681736162.jpg',
    isAuthenticPhoto: p.isAuthenticPhoto
  };
});

export const INITIAL_EXPENSES: SalonExpense[] = [
  {
    id: 'exp-101',
    date: '2026-11-01',
    category: 'Rent',
    description: 'Nyali Petrocity 2nd Floor - Monthly Salon Premise Rent',
    amountKSh: 65000,
    paidTo: 'Petrocity Management Ltd',
    paymentMethod: 'Bank Transfer',
    receiptRef: 'TXN-RENT-NOV26'
  },
  {
    id: 'exp-102',
    date: '2026-11-01',
    category: 'Utilities & Power',
    description: 'KPLC Electricity Prepaid Tokens for Salon Dryers & Steamers',
    amountKSh: 14500,
    paidTo: 'Kenya Power & Lighting Co.',
    paymentMethod: 'M-Pesa',
    receiptRef: 'KPLC-8492019'
  },
  {
    id: 'exp-103',
    date: '2026-10-30',
    category: 'Salon Supplies & Products',
    description: 'Organic Essential Oils, Cold-Pressed Jojoba, and Bamboo Facial Towels',
    amountKSh: 18200,
    paidTo: 'Nairobi Botanical Wholesalers',
    paymentMethod: 'M-Pesa',
    receiptRef: 'MP-NB83910'
  },
  {
    id: 'exp-104',
    date: '2026-10-29',
    category: 'Staff Welfare & Tea',
    description: 'Weekly salon herbal tea bags, drinking water dispensers, and milk',
    amountKSh: 3800,
    paidTo: 'Naivas Nyali Supermarket',
    paymentMethod: 'M-Pesa',
    receiptRef: 'NVS-92810'
  },
  {
    id: 'exp-105',
    date: '2026-10-28',
    category: 'Repairs & Maintenance',
    description: 'Hair steamer heating coil maintenance and salon chair hydraulic servicing',
    amountKSh: 6500,
    paidTo: 'Mombasa Salon Equipment Repairs',
    paymentMethod: 'Cash',
    receiptRef: 'RCP-8472'
  }
];

export const INITIAL_DAILY_SALES: DailySaleEntry[] = [
  {
    id: 'sal-201',
    date: '2026-11-02',
    time: '10:30 AM',
    clientName: 'Amina Mohamed',
    clientPhone: '+254 722 109 234',
    type: 'Service',
    itemName: 'Bareglow Signature Radiance Facial',
    staffName: 'Faith Mwangi',
    quantity: 1,
    amountKSh: 6500,
    paymentMethod: 'M-Pesa',
    notes: 'Paid via Till 9597237'
  },
  {
    id: 'sal-202',
    date: '2026-11-02',
    time: '11:45 AM',
    clientName: 'Amina Mohamed',
    clientPhone: '+254 722 109 234',
    type: 'Product Retail',
    itemName: 'Oshaprapra body scrub (300g)',
    staffName: 'Faith Mwangi',
    quantity: 1,
    amountKSh: 1500,
    paymentMethod: 'M-Pesa',
    notes: 'Purchased after facial'
  },
  {
    id: 'sal-203',
    date: '2026-11-02',
    time: '01:15 PM',
    clientName: 'Wanjiku Kamau',
    clientPhone: '+254 733 891 029',
    type: 'Service',
    itemName: 'Micro small knotless braids',
    staffName: 'Grace Atieno',
    quantity: 1,
    amountKSh: 4000,
    paymentMethod: 'M-Pesa',
    notes: 'Paid via Till 9597237'
  },
  {
    id: 'sal-204',
    date: '2026-11-02',
    time: '03:30 PM',
    clientName: 'David Muthomi',
    clientPhone: '+254 710 492 810',
    type: 'Service',
    itemName: 'Adult Haircut & Style + Beard shave',
    staffName: 'Brian Ochieng',
    quantity: 1,
    amountKSh: 1000,
    paymentMethod: 'Cash',
    notes: 'Cash payment received'
  },
  {
    id: 'sal-205',
    date: '2026-11-02',
    time: '04:45 PM',
    clientName: 'Lucy Kerubo',
    clientPhone: '+254 791 284 910',
    type: 'Service',
    itemName: 'Gel + Pedicure & Tips Nails',
    staffName: 'Sarah Njeri',
    quantity: 1,
    amountKSh: 4500,
    paymentMethod: 'M-Pesa',
    notes: 'Paid via Till 9597237'
  }
];

export const INITIAL_TILL_HANDOVERS: DailyTillHandover[] = [
  {
    id: 'th-20261102',
    date: '2026-11-02',
    closingTime: '07:30 PM',
    cashierName: 'Mercy Achieng (Front Desk)',
    totalSalesCount: 5,
    grossSalesKSh: 17500,
    expectedCashKSh: 1000,
    actualCashKSh: 1000,
    cashVarianceKSh: 0,
    expectedMpesaKSh: 16500,
    actualMpesaKSh: 16500,
    mpesaVarianceKSh: 0,
    cashExpensesPaidKSh: 0,
    totalExpensesKSh: 0,
    status: 'Balanced',
    notes: 'All client payments matched M-Pesa Buy Goods Till 9597237 and Cash drawer exactly. Handover verified and balanced.',
    submittedAt: '2026-11-02 19:35',
    verifiedByOwner: true
  }
];

