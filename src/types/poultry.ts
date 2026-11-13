export type PoultryBreed = 
  | 'Cobb 500 Broiler' 
  | 'Ross 308 Broiler' 
  | 'Hubbard Broiler' 
  | 'Commercial Broiler' 
  | 'Kuroiler (Meat)' 
  | 'Broiler (Other)';

export type FlockStage = 
  | 'Day 1-7 (Brooding & Starter)' 
  | 'Week 2-3 (Grower Transition)' 
  | 'Week 4-5 (Finisher & Weight Gain)' 
  | 'Week 5-6 (Market Ready / Slaughter)' 
  | 'Sold Out / Harvested';

export type HealthStatus = 'Healthy' | 'Observation' | 'Under Treatment' | 'Vaccinated';

export type ChickDeliveryStatus = 
  | 'Delivered to Farm' // Wamewasili shambani na wamo bandani
  | 'Ordered & Paid (Awaiting Delivery)' // Vifaranga vimeagizwa na kulipwa Interchick, vinasubiri kuwasili
  | 'Pending Dispatch';

export interface PoultryBatch {
  id: string;
  batchName: string; // e.g. "Batch #01 - Interchick Cobb 500 Broilers"
  breed: PoultryBreed;
  entryDate: string; // Date day-old broiler chicks arrived or expected
  orderDate?: string; // Date ordered & paid to supplier (Interchick)
  expectedDeliveryDate?: string; // Expected delivery date to the farm
  deliveryStatus?: ChickDeliveryStatus; // 'Delivered to Farm' or 'Ordered & Paid (Awaiting Delivery)'
  hatcheryOrderRef?: string; // e.g. "INTERCHICK-ORD-8821"
  isSupplierPaid?: boolean; // True if chicks have already been paid for
  initialQuantity: number;
  currentQuantity: number;
  purchasePricePerBirdTZS: number; // e.g. 2,200 TZS per day-old broiler chick
  totalPurchaseCostTZS: number; // initialQuantity * purchasePricePerBirdTZS
  supplier: string; // e.g. "Interchick Tanzania", "Silverlands Tanzania", "Twiga Chick"
  sourceType: 'Day-old chicks' | 'Point of Lay pullets' | 'Month-old chicks' | 'Mature birds';
  stage: FlockStage;
  targetSellingPricePerBirdTZS: number; // e.g. 11,000 TZS to 13,000 TZS per mature broiler
  targetWeightKg?: number; // e.g. 2.0 kg live weight
  currentAverageWeightKg?: number; // e.g. 1.85 kg
  targetSaleDate?: string;
  status: 'Active' | 'Sold Out' | 'Archived';
  notes?: string;
  // Backward compatibility alias getters/fields if loaded from existing cache
  purchasePricePerBirdKSh?: number;
  totalPurchaseCostKSh?: number;
  targetSellingPricePerBirdKSh?: number;
}

export interface VaccinationRecord {
  id: string;
  batchId: string;
  batchName: string;
  vaccineName: string; // e.g. "Gumboro (IBD) 1st Dose (Day 7-10)", "Newcastle Lasota (Day 14-16)", "Gumboro Booster (Day 18-21)"
  targetDate: string;
  administeredDate?: string;
  status: 'Scheduled' | 'Completed' | 'Overdue';
  route: 'Drinking Water' | 'Eye Drop' | 'Wing Web' | 'Subcutaneous Injection';
  costTZS: number; // TZS
  administeredBy: string;
  notes?: string;
  costKSh?: number;
}

export interface FeedRecord {
  id: string;
  batchId: string;
  batchName: string;
  date: string;
  feedType: 'Broiler Starter' | 'Broiler Finisher' | 'Chick Starter' | 'Pumba (Mahindi / Mpunga)' | 'Growers Mash' | 'Grains / Sunflower Meal';
  quantityKg: number;
  costPerKgTZS?: number; // e.g. 1,500 TZS/kg
  totalCostTZS: number;
  brandOrSource: string; // e.g. "Interchick Broiler Pellets", "Silverlands Tanzania", "Kibo Feeds", "Kinu cha Karibu"
  notes?: string;
  costPerKgKSh?: number;
  totalCostKSh?: number;
}

export interface MortalityRecord {
  id: string;
  batchId: string;
  batchName: string;
  date: string;
  deathCount: number;
  suspectedCause: 
    | 'Heat stress' 
    | 'Cold / Brooding Chilling' 
    | 'Suspected Coccidiosis' 
    | 'Ascites (Maji Tumboni)' 
    | 'Sudden Death Syndrome (SDS)' 
    | 'Respiratory / Mafua' 
    | 'Predator/Injury' 
    | 'Unknown' 
    | 'Other';
  actionTaken: string; // e.g. "Adjusted brooder temperature, provided electrolytes in drinking water"
  notes?: string;
}

export type PoultryExpenseCategory =
  | 'Pumba (Pumba ya Mahindi / Mpunga)'
  | 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)'
  | 'Bedding & Wood Shavings / Maranda'
  | 'Electricity & Heating/Brooding (Mkaa / Gesi)'
  | 'Feed & Supplements'
  | 'Vaccines & Veterinary'
  | 'Water & Hygiene (Virkon S)'
  | 'Labor & Farm Staff (Mshahara)'
  | 'Transport & Crates'
  | 'Equipment & Feeders'
  | 'Other';

export interface PoultryExpense {
  id: string;
  batchId?: string;
  batchName?: string;
  date: string;
  category: PoultryExpenseCategory;
  description: string;
  amountTZS: number;
  paidTo: string;
  paymentMethod: 'Vodacom M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Halopesa' | 'CRDB / NMB Bank' | 'Cash';
  receiptRef?: string;
  amountKSh?: number;
}

export type SalePaymentStatus = 
  | 'Paid' // Imelipwa Kamili
  | 'Unpaid / Pending Payment' // Kuku waliopelekwa lakini bado hawajalipwa (Deni la Mteja)
  | 'Partial Payment'; // Imelipwa nusu, baki inadaiwa

export interface PoultrySale {
  id: string;
  batchId: string;
  batchName: string;
  date: string;
  saleType: 
    | 'Live Broilers (Kuku Hai)' 
    | 'Dressed / Slaughtered Meat (Nyama)' 
    | 'Live Birds' 
    | 'Dressed / Slaughtered Meat' 
    | 'Broiler Cut-ups / Fillets (Nyama ya Vipande)' 
    | 'Manure (Mbolea ya Banda)';
  quantitySold: number; // Number of broiler chickens sold (idadi ya kuku)
  sellingPricePerUnitTZS: number; // e.g. 11,000 TZS per mature broiler
  totalRevenueTZS: number;
  buyerName: string;
  buyerPhone?: string;
  // Delivery and unpaid status (kuku waliopelekwa lakini hawajalipwa)
  deliveryStatus?: 'Delivered' | 'Pending Delivery';
  deliveredDate?: string;
  paymentStatus?: SalePaymentStatus;
  amountPaidTZS?: number; // Kiasi kilicholipwa
  amountDueTZS?: number; // Kiasi kinachodaiwa (kuku waliopelekwa bila kulipwa)
  paymentDueDate?: string; // Tarehe ya ahadi ya kulipa deni
  paymentMethod: 'Vodacom M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Halopesa' | 'CRDB / NMB Bank' | 'Cash' | 'Credit / Bado Kulipwa';
  paymentRef?: string;
  notes?: string;
  sellingPricePerUnitKSh?: number;
  totalRevenueKSh?: number;
  mpesaRef?: string;
}

export interface FarmFinancialSummary {
  totalBirdsPurchased: number;
  totalMortality: number;
  currentLiveBirds: number;
  mortalityRatePercent: number;
  totalBirdsSold: number;
  totalPurchaseExpenseTZS: number;
  totalFeedExpenseTZS: number;
  totalMedicationExpenseTZS: number;
  totalPumbaExpenseTZS: number;
  totalMedicineExpenseTZS: number;
  totalOtherExpensesTZS: number;
  grandTotalExpensesTZS: number;
  totalRevenueTZS: number;
  // Cash vs Unpaid Deliveries tracking
  totalCashCollectedTZS: number; // Pesa iliyopokelewa
  totalUnpaidReceivablesTZS: number; // Kuku waliopelekwa lakini bado hawajalipwa (Madeni ya kuku)
  unpaidBirdsCount: number; // Idadi ya kuku waliopelekwa bila malipo
  pendingChickOrdersCount: number; // Vifaranga vilivyoagizwa/kulipwa Interchick lakini bado havijafika shambani
  pendingChickOrdersCostTZS: number; // Gharama ya vifaranga vilivyolipwa mapema Interchick
  netProfitLossTZS: number;
  isProfit: boolean;
  averageProfitPerBirdSoldTZS: number;
}

export interface PoultryFarmProfile {
  farmName: string;
  country: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  region: string;
  specialization: string; // e.g. "Commercial Broiler Meat Farming"
}
