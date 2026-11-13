import {
  PoultryBatch,
  VaccinationRecord,
  FeedRecord,
  MortalityRecord,
  PoultryExpense,
  PoultrySale,
  PoultryFarmProfile
} from '../types/poultry';

export const BLESSED_POULTRY_PROFILE: PoultryFarmProfile = {
  farmName: 'Blessed Poultry Farm',
  country: 'Tanzania',
  phone: '0757 895 896',
  email: 'blessedkapuya@gmail.com',
  currency: 'TZS',
  currencySymbol: 'TSh',
  region: 'Tanzania (Dar es Salaam & Pwani)',
  specialization: 'Commercial Broiler Meat Production (Kuku wa Nyama)'
};

export const INITIAL_POULTRY_BATCHES: PoultryBatch[] = [
  {
    id: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    breed: 'Cobb 500 Broiler',
    entryDate: '2026-10-02', // Day 33 of 35-day cycle
    orderDate: '2026-09-24',
    deliveryStatus: 'Delivered to Farm',
    isSupplierPaid: true,
    hatcheryOrderRef: 'INTERCHICK-ORD-8812',
    initialQuantity: 500,
    currentQuantity: 347, // 500 - 18 (mortalities) - 60 (paid) - 45 (delivered unpaid) - 30 (delivered partial)
    purchasePricePerBirdTZS: 2200, // TSh 2,200 kwa kifaranga cha broiler cha siku 1
    totalPurchaseCostTZS: 1100000,
    supplier: 'Interchick Tanzania (Dar es Salaam Hatchery)',
    sourceType: 'Day-old chicks',
    stage: 'Week 5-6 (Market Ready / Slaughter)',
    targetSellingPricePerBirdTZS: 11000,
    targetWeightKg: 2.1,
    currentAverageWeightKg: 2.05,
    targetSaleDate: '2026-11-06',
    status: 'Active',
    notes: 'Banda A. Broilers wamekua vizuri sana. Uzito wastani 2.05kg. Wako tayari kwa mauzo ya kuku hai na kuchinja.'
  },
  {
    id: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    breed: 'Ross 308 Broiler',
    entryDate: '2026-10-15', // Day 20 of cycle
    orderDate: '2026-10-05',
    deliveryStatus: 'Delivered to Farm',
    isSupplierPaid: true,
    hatcheryOrderRef: 'SILVER-ORD-5501',
    initialQuantity: 600,
    currentQuantity: 588, // 600 - 12 (mortalities)
    purchasePricePerBirdTZS: 2250,
    totalPurchaseCostTZS: 1350000,
    supplier: 'Silverlands Tanzania (Iringa / Dar Depot)',
    sourceType: 'Day-old chicks',
    stage: 'Week 2-3 (Grower Transition)',
    targetSellingPricePerBirdTZS: 11500,
    targetWeightKg: 2.2,
    currentAverageWeightKg: 1.15,
    targetSaleDate: '2026-11-20',
    status: 'Active',
    notes: 'Banda B. Wanakula Broiler Starter na kubadilishiwa Broiler Finisher. Afya na ulaji ni mzuri.'
  },
  {
    id: 'batch-tz-03',
    batchName: 'Batch #03 - Twiga Chick Broilers (Vifaranga)',
    breed: 'Commercial Broiler',
    entryDate: '2026-10-27', // Day 8 of cycle
    orderDate: '2026-10-18',
    deliveryStatus: 'Delivered to Farm',
    isSupplierPaid: true,
    hatcheryOrderRef: 'TWIGA-ORD-3329',
    initialQuantity: 400,
    currentQuantity: 394, // 400 - 6 (brooding loss)
    purchasePricePerBirdTZS: 2200,
    totalPurchaseCostTZS: 880000,
    supplier: 'Twiga Chick Hatcheries Tanzania',
    sourceType: 'Day-old chicks',
    stage: 'Day 1-7 (Brooding & Starter)',
    targetSellingPricePerBirdTZS: 11000,
    targetWeightKg: 2.0,
    currentAverageWeightKg: 0.28,
    targetSaleDate: '2026-12-02',
    status: 'Active',
    notes: 'Banda C (Brooder). Taa za joto na mkaa safi. Wamepata chanjo ya kwanza ya Gumboro.'
  },
  {
    id: 'batch-tz-04',
    batchName: 'Batch #04 - Interchick Cobb 500 (Oda Iliyolipwa - Inasubiriwa Shambani)',
    breed: 'Cobb 500 Broiler',
    entryDate: '2026-11-10', // Expected arrival date
    orderDate: '2026-11-02', // Date booked and paid in advance
    expectedDeliveryDate: '2026-11-10',
    deliveryStatus: 'Ordered & Paid (Awaiting Delivery)',
    isSupplierPaid: true, // Order fully paid to Interchick
    hatcheryOrderRef: 'INTERCHICK-ORD-9942',
    initialQuantity: 700,
    currentQuantity: 0, // Still in hatchery incubator, 0 live birds in brooder yet
    purchasePricePerBirdTZS: 2200,
    totalPurchaseCostTZS: 1540000, // TSh 1,540,000 paid to Interchick
    supplier: 'Interchick Tanzania (Dar es Salaam Hatchery)',
    sourceType: 'Day-old chicks',
    stage: 'Day 1-7 (Brooding & Starter)',
    targetSellingPricePerBirdTZS: 11500,
    targetWeightKg: 2.1,
    currentAverageWeightKg: 0.04,
    targetSaleDate: '2026-12-15',
    status: 'Active',
    notes: 'Vifaranga 700 vya Broiler vimeagizwa na kulipwa kamili Interchick (TSh 1,540,000). Vinasubiriwa kuwasili shambani tarehe 10 Novemba 2026. Banda D limetayarishwa na maranda yapo tayari.'
  }
];

export const INITIAL_VACCINATIONS: VaccinationRecord[] = [
  {
    id: 'vac-tz-01',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    vaccineName: 'Gumboro (IBD) Dose ya Kwanza (Siku ya 8)',
    targetDate: '2026-10-10',
    administeredDate: '2026-10-10',
    status: 'Completed',
    route: 'Drinking Water',
    costTZS: 22000,
    administeredBy: 'Vet John (Mtaalamu wa Mifugo)',
    notes: 'Ilipewa kwenye maji safi ya kunywa na maziwa ya unga kuzuia chlorine. Vifaranga wote wako salama.'
  },
  {
    id: 'vac-tz-02',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    vaccineName: 'Newcastle / Mdondo (Lasota + IB) (Siku ya 15)',
    targetDate: '2026-10-17',
    administeredDate: '2026-10-17',
    status: 'Completed',
    route: 'Eye Drop',
    costTZS: 25000,
    administeredBy: 'Vet John',
    notes: 'Tone la jicho kwa kuku 490 wa broiler. Kinga imekaa vizuri.'
  },
  {
    id: 'vac-tz-03',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    vaccineName: 'Gumboro Booster Dose ya Pili (Siku ya 21)',
    targetDate: '2026-10-23',
    administeredDate: '2026-10-23',
    status: 'Completed',
    route: 'Drinking Water',
    costTZS: 22000,
    administeredBy: 'Msimamizi wa Shamba',
    notes: 'Walinyimwa maji saa 2 kabla ya chanjo ili wanywe haraka ndani ya saa moja.'
  },
  {
    id: 'vac-tz-04',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    vaccineName: 'Gumboro Booster Dose ya Pili (Siku ya 21)',
    targetDate: '2026-11-05',
    status: 'Scheduled',
    route: 'Drinking Water',
    costTZS: 25000,
    administeredBy: 'Vet John',
    notes: 'Imepangwa kwa kuku 588 wa Banda B.'
  },
  {
    id: 'vac-tz-05',
    batchId: 'batch-tz-03',
    batchName: 'Batch #03 - Twiga Chick Broilers (Vifaranga)',
    vaccineName: 'Newcastle / Mdondo Lasota (Siku ya 14)',
    targetDate: '2026-11-10',
    status: 'Scheduled',
    route: 'Drinking Water',
    costTZS: 20000,
    administeredBy: 'Mhudumu wa Shamba',
    notes: 'Kuzuia ugonjwa wa kideri/mdondo kwa vifaranga vya Banda C.'
  }
];

export const INITIAL_FEEDS: FeedRecord[] = [
  {
    id: 'feed-tz-01',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-10',
    feedType: 'Broiler Starter',
    quantityKg: 300, // Mifuko 6 ya 50kg
    costPerKgTZS: 1550, // TSh 77,500 kwa mfuko wa 50kg
    totalCostTZS: 465000,
    brandOrSource: 'Interchick Broiler Starter Crumbs',
    notes: 'Vifaranga walianza vizuri sana, kiwango cha ubadilishaji wa chakula (FCR) kiko juu'
  },
  {
    id: 'feed-tz-02',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-24',
    feedType: 'Broiler Finisher',
    quantityKg: 650, // Mifuko 13 ya 50kg
    costPerKgTZS: 1500, // TSh 75,000 kwa mfuko wa 50kg
    totalCostTZS: 975000,
    brandOrSource: 'Silverlands Broiler Finisher Pellets',
    notes: 'Broiler finisher pellets kwa ajili ya kuongeza uzito wa haraka kufikia 2.0kg - 2.3kg'
  },
  {
    id: 'feed-tz-03',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    date: '2026-10-25',
    feedType: 'Broiler Starter',
    quantityKg: 400, // Mifuko 8
    costPerKgTZS: 1550,
    totalCostTZS: 620000,
    brandOrSource: 'Tanfeeds Broiler Starter',
    notes: 'Ukuaji wa vifaranga wa Ross 308 unaendelea kwa kasi nzuri'
  },
  {
    id: 'feed-tz-04',
    batchId: 'batch-tz-03',
    batchName: 'Batch #03 - Twiga Chick Broilers (Vifaranga)',
    date: '2026-10-29',
    feedType: 'Chick Starter',
    quantityKg: 200, // Mifuko 4
    costPerKgTZS: 1580,
    totalCostTZS: 316000,
    brandOrSource: 'Interchick Chick Starter Crumbs',
    notes: 'Chakula cha vifaranga cha wiki ya kwanza bandani'
  }
];

export const INITIAL_MORTALITY: MortalityRecord[] = [
  {
    id: 'mort-tz-01',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-04',
    deathCount: 8,
    suspectedCause: 'Cold / Brooding Chilling',
    actionTaken: 'Kuongeza taa za joto na mkaa wa kupashia banda wakati wa mvua ya usiku',
    notes: 'Vifaranga walirundikana kona moja usiku wa siku ya 2'
  },
  {
    id: 'mort-tz-02',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-18',
    deathCount: 6,
    suspectedCause: 'Heat stress',
    actionTaken: 'Kuweka vyombo vya ziada vya maji na kumwagilia maji juu ya bati mchana',
    notes: 'Joto lilipanda kufikia nyuzi 34C mchana, broilers wazito wanahitaji hewa ya kutosha'
  },
  {
    id: 'mort-tz-03',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-28',
    deathCount: 4,
    suspectedCause: 'Ascites (Maji Tumboni)',
    actionTaken: 'Kufungua madirisha ya pembeni kuongeza hewa safi ya oksijeni na kurekebisha urefu wa vyombo vya chakula',
    notes: 'Broiler aliyekua kwa kasi kubwa, moyo ulileta maji tumboni. Uingizaji hewa umeboreshwa'
  },
  {
    id: 'mort-tz-04',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    date: '2026-10-20',
    deathCount: 7,
    suspectedCause: 'Sudden Death Syndrome (SDS)',
    actionTaken: 'Kupunguza saa za mwanga usiku ili kuzuia kula chakula bila kupumzika',
    notes: 'Kifo cha ghafla kwa broiler mzito aliyeruka'
  },
  {
    id: 'mort-tz-05',
    batchId: 'batch-tz-03',
    batchName: 'Batch #03 - Twiga Chick Broilers (Vifaranga)',
    date: '2026-10-29',
    deathCount: 6,
    suspectedCause: 'Cold / Brooding Chilling',
    actionTaken: 'Kuzungushia makaratasi ya kuzuia upepo (brooder guard) na kuongeza taa za infrared',
    notes: 'Vifaranga vidogo vilipata baridi usiku wa kwanza'
  }
];

export const INITIAL_POULTRY_EXPENSES: PoultryExpense[] = [
  {
    id: 'pexp-tz-01',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-12',
    category: 'Pumba (Pumba ya Mahindi / Mpunga)',
    description: 'Pumba safi ya Mahindi (Magunia 8 @ TSh 18,000) kwa ajili ya kuchanganya na kunyoosha chakula',
    amountTZS: 144000,
    paidTo: 'Kinu cha Kusaga Mahindi (Milling Center Dar)',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-PUMBA-882'
  },
  {
    id: 'pexp-tz-02',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-16',
    category: 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)',
    description: 'Medecine: ESB3 Dawa ya Coccidiosis + Amin\'Total Multivitamins & Minerals kwa ajili ya uzito wa broiler',
    amountTZS: 85000,
    paidTo: 'Tanzania Agrovet Pharmacy',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-MED-994'
  },
  {
    id: 'pexp-tz-03',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-02',
    category: 'Bedding & Wood Shavings / Maranda',
    description: 'Maranda makavu ya mbao (Magunia 12 @ TSh 8,000) kwa ajili ya sakafu ya joto ya broilers Banda A',
    amountTZS: 96000,
    paidTo: 'Kiwanda cha Mbao Mwenge',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-MARANDA-410'
  },
  {
    id: 'pexp-tz-04',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-02',
    category: 'Electricity & Heating/Brooding (Mkaa / Gesi)',
    description: 'Mkaa safi wa joto la vifaranga vya broiler (Magunia 4 @ TSh 25,000) + taa za infrared',
    amountTZS: 125000,
    paidTo: 'Wauzaji wa Mkaa na Vifaa Kariakoo',
    paymentMethod: 'Tigo Pesa',
    receiptRef: 'TIGO-99321'
  },
  {
    id: 'pexp-tz-05',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    date: '2026-10-18',
    category: 'Equipment & Feeders',
    description: 'Mitungi ya maji ya kuku (Bell Drinkers 8) + trei za kulishia vifaranga vya broiler',
    amountTZS: 140000,
    paidTo: 'Agrovet Tanzania Ltd',
    paymentMethod: 'CRDB / NMB Bank',
    receiptRef: 'CRDB-TX-4401'
  },
  {
    id: 'pexp-tz-06',
    date: '2026-10-31',
    category: 'Labor & Farm Staff (Mshahara)',
    description: 'Mshahara na posho ya mhudumu na msimamizi wa mabanda ya broilers (Mwezi Oktoba)',
    amountTZS: 350000,
    paidTo: 'Juma Ramadhani (Mhudumu wa Shamba)',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-SAL-90124'
  },
  {
    id: 'pexp-tz-07',
    date: '2026-10-25',
    category: 'Water & Hygiene (Virkon S)',
    description: 'Dawa ya kuua vijidudu (Virkon S 500g) na vidonge vya kusafisha maji ya kunywa ya kuku',
    amountTZS: 55000,
    paidTo: 'Tanzania Vet Care Pharmacy',
    paymentMethod: 'Cash',
    receiptRef: 'CSH-TZ-301'
  },
  {
    id: 'pexp-tz-08',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    date: '2026-11-01',
    category: 'Pumba (Pumba ya Mahindi / Mpunga)',
    description: 'Pumba safi ya Mahindi (Magunia 6 @ TSh 18,000) kwa ajili ya mwezi Novemba (Broilers Banda B)',
    amountTZS: 108000,
    paidTo: 'Kinu cha Kusaga Mahindi (Milling Center Dar)',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-PUMBA-1101'
  },
  {
    id: 'pexp-tz-09',
    batchId: 'batch-tz-02',
    batchName: 'Batch #02 - Silverlands Ross 308 Broilers',
    date: '2026-11-02',
    category: 'Medecine & Dawa (Antibiotics, Vitamins, Dewormers)',
    description: 'Medecine: Vitalyte Electrolytes & Broiler Growth Booster (Novemba)',
    amountTZS: 65000,
    paidTo: 'Tanzania Agrovet Pharmacy',
    paymentMethod: 'Vodacom M-Pesa',
    receiptRef: 'VODA-MED-1102'
  }
];

export const INITIAL_POULTRY_SALES: PoultrySale[] = [
  {
    id: 'sale-tz-01',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-10-30',
    saleType: 'Live Broilers (Kuku Hai)',
    quantitySold: 60,
    sellingPricePerUnitTZS: 11000,
    totalRevenueTZS: 660000,
    buyerName: 'Mikocheni BBQ & Grill Garden',
    buyerPhone: '0757895896',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    amountPaidTZS: 660000,
    amountDueTZS: 0,
    paymentMethod: 'Vodacom M-Pesa',
    paymentRef: 'VODA-TZ-9821A',
    notes: 'Kuku 60 wa broiler wazito, wastani wa uzito 2.1kg kila mmoja'
  },
  {
    id: 'sale-tz-02',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-11-01',
    saleType: 'Dressed / Slaughtered Meat (Nyama)',
    quantitySold: 50,
    sellingPricePerUnitTZS: 12500,
    totalRevenueTZS: 625000,
    buyerName: 'Supermarket Mbezi Beach',
    buyerPhone: '0757895896',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    amountPaidTZS: 625000,
    amountDueTZS: 0,
    paymentMethod: 'CRDB / NMB Bank',
    paymentRef: 'NMB-TRANS-771',
    notes: 'Kuku wa broiler waliochinjwa, kusafishwa na kufungwa kwenye vifungashio safi vya kilo 1.8 - 2.0kg'
  },
  {
    id: 'sale-tz-03',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-11-03',
    saleType: 'Live Broilers (Kuku Hai)',
    quantitySold: 40,
    sellingPricePerUnitTZS: 11500,
    totalRevenueTZS: 460000,
    buyerName: 'Mlimani City Hotel & Restaurant',
    buyerPhone: '0757895896',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    amountPaidTZS: 460000,
    amountDueTZS: 0,
    paymentMethod: 'Vodacom M-Pesa',
    paymentRef: 'VODA-TZ-1102B',
    notes: 'Kuku wa nyama wakubwa kwa ajili ya jikoni la hoteli'
  },
  {
    id: 'sale-tz-04',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-11-04',
    saleType: 'Live Broilers (Kuku Hai)',
    quantitySold: 45,
    sellingPricePerUnitTZS: 11500,
    totalRevenueTZS: 517500,
    buyerName: 'Kariakoo BBQ & Roasters (Bw. Rashid)',
    buyerPhone: '0757895896',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Unpaid / Pending Payment', // Delivered but NOT paid for
    amountPaidTZS: 0,
    amountDueTZS: 517500,
    paymentDueDate: '2026-11-08',
    paymentMethod: 'Credit / Bado Kulipwa',
    notes: 'Kuku 45 wa broiler wamepelekwa jikoni Kariakoo lakini bado hawajalipwa (Deni). Ahadi ya kulipa tarehe 08 Novemba kwa Vodacom M-Pesa.'
  },
  {
    id: 'sale-tz-05',
    batchId: 'batch-tz-01',
    batchName: 'Batch #01 - Interchick Cobb 500 Broilers',
    date: '2026-11-04',
    saleType: 'Dressed / Slaughtered Meat (Nyama)',
    quantitySold: 30,
    sellingPricePerUnitTZS: 12000,
    totalRevenueTZS: 360000,
    buyerName: 'Mama Neema Catering Sinza',
    buyerPhone: '0757895896',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Partial Payment', // Delivered, partial paid
    amountPaidTZS: 160000,
    amountDueTZS: 200000,
    paymentDueDate: '2026-11-07',
    paymentMethod: 'Vodacom M-Pesa',
    notes: 'Kuku 30 waliochinjwa wamepelekwa. Amelipa TSh 160,000 taslimu kwa M-Pesa, baki TSh 200,000 atamalizia tarehe 07 Novemba.'
  }
];
