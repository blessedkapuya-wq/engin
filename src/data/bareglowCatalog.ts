export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  size: string;
  priceKSh: number;
  image?: string;
  isAuthenticPhoto?: boolean;
}

export interface CatalogService {
  id: string;
  name: string;
  department: string;
  subCategory: string;
  duration?: string;
  priceKSh: number;
}

export const SALON_INFO = {
  name: 'Bareglow Boutiques and Spa',
  tagline: 'Organic . Natural . Healthy',
  owner: 'Tinez Kapuya',
  address: 'Links Road Nyali, Petrocity Second Floor, Mombasa, Kenya',
  phone: '+254 796 134 777',
  whatsapp: '+254796134777',
  mpesaTill: '9597237',
  workingHours: {
    weekdays: '8:30 AM – 7:30 PM',
    saturday: '8:00 AM – 7:30 PM',
    sunday: '10:00 AM – 5:00 PM'
  }
};

export const BAREGLOW_PRODUCT_CATEGORIES = [
  'All',
  'Cleansers & washes',
  'Soaps',
  'Serums',
  'Toners',
  'Oils & mists',
  'Face care',
  'Body & hands',
  'Scrubs & powders',
  'Lip care & extras',
  'Shampoo & treatments',
  'Hair oils',
  "Men's care"
];

export const BAREGLOW_PRODUCTS: CatalogProduct[] = [
  // Cleansers & washes
  { id: 'p-1', name: 'Salicylic cleanser', category: 'Cleansers & washes', size: '120 ml', priceKSh: 1200 },
  { id: 'p-2', name: 'Niacinamide cleanser', category: 'Cleansers & washes', size: '120 ml', priceKSh: 1200 },
  { id: 'p-3', name: 'Vitamin C cleanser', category: 'Cleansers & washes', size: '120 ml', priceKSh: 1200 },
  { id: 'p-4', name: 'Kojic cleanser', category: 'Cleansers & washes', size: '120 ml', priceKSh: 1200 },
  { id: 'p-5', name: 'Nila cleanser', category: 'Cleansers & washes', size: '120 ml', priceKSh: 1200 },
  { id: 'p-6', name: 'Exfoliation body wash', category: 'Cleansers & washes', size: '500 ml', priceKSh: 1800 },
  { id: 'p-7', name: 'Kojic shower gel', category: 'Cleansers & washes', size: '500 ml', priceKSh: 1800 },

  // Soaps
  { id: 'p-8', name: 'Kojic + goat milk soap', category: 'Soaps', size: '100 g', priceKSh: 700, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },
  { id: 'p-9', name: 'Kojic + arbutin soap', category: 'Soaps', size: '100 g', priceKSh: 1000, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },
  { id: 'p-10', name: 'Oshaprapra super brightening soap', category: 'Soaps', size: '100 g', priceKSh: 1500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-11', name: 'Moroccan black molato soap secret', category: 'Soaps', size: 'Standard', priceKSh: 2500, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },
  { id: 'p-12', name: 'Oshaprapra soap', category: 'Soaps', size: '500 g', priceKSh: 4500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-13', name: 'Nila soap', category: 'Soaps', size: 'Standard', priceKSh: 800, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },

  // Serums / 01 & 02
  { id: 'p-14', name: 'Vitamin C + hyaluronic acid serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-15', name: 'Retinol serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-16', name: 'Kojic serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-17', name: 'Niacinamide serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-18', name: 'Glutathione serum', category: 'Serums', size: '30 ml', priceKSh: 1800 },
  { id: 'p-19', name: 'Snail mucin serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-20', name: 'Flawless serum', category: 'Serums', size: '30 ml', priceKSh: 2000 },
  { id: 'p-21', name: 'Vitamin E serum', category: 'Serums', size: '30 ml', priceKSh: 500 },
  { id: 'p-22', name: 'Korean serum', category: 'Serums', size: '30 g', priceKSh: 2000 },
  { id: 'p-23', name: 'Pink Korean serum', category: 'Serums', size: '30 g', priceKSh: 2500 },
  { id: 'p-24', name: 'Glycolic serum', category: 'Serums', size: '30 ml', priceKSh: 2000 },
  { id: 'p-25', name: 'Nila serum', category: 'Serums', size: '30 ml', priceKSh: 1500 },
  { id: 'p-26', name: 'Melasma serum', category: 'Serums', size: '30 ml', priceKSh: 2000 },
  { id: 'p-27', name: 'Glutathione ampoule', category: 'Serums', size: '30 ml', priceKSh: 2000 },

  // Toners
  { id: 'p-28', name: 'Salicylic toner (120ml)', category: 'Toners', size: '120 ml', priceKSh: 1200 },
  { id: 'p-29', name: 'Salicylic toner (250ml)', category: 'Toners', size: '250 ml', priceKSh: 1500 },
  { id: 'p-30', name: 'Niacinamide toner', category: 'Toners', size: '120 ml', priceKSh: 1200 },
  { id: 'p-31', name: 'Vitamin C toner', category: 'Toners', size: '120 ml', priceKSh: 1200 },
  { id: 'p-32', name: 'Kojic toner', category: 'Toners', size: '120 ml', priceKSh: 1200 },
  { id: 'p-33', name: 'Glycolic toner', category: 'Toners', size: '120 ml', priceKSh: 1500 },
  { id: 'p-34', name: 'Nila toner', category: 'Toners', size: '120 ml', priceKSh: 1200 },

  // Oils & mists
  { id: 'p-35', name: 'Rose water mist (120ml)', category: 'Oils & mists', size: '120 ml', priceKSh: 500 },
  { id: 'p-36', name: 'Rose water mist (250ml)', category: 'Oils & mists', size: '250 ml', priceKSh: 800 },
  { id: 'p-37', name: 'Egyptian oil', category: 'Oils & mists', size: '30 ml', priceKSh: 1500 },
  { id: 'p-38', name: 'Body oil', category: 'Oils & mists', size: '120 ml', priceKSh: 800 },
  { id: 'p-39', name: 'Vitamin E oil', category: 'Oils & mists', size: '120 ml', priceKSh: 1000 },
  { id: 'p-40', name: 'Rose hip oil', category: 'Oils & mists', size: '120 ml', priceKSh: 1500 },
  { id: 'p-41', name: 'Argan oil', category: 'Oils & mists', size: '120 ml', priceKSh: 1500 },

  // Face care
  { id: 'p-42', name: 'Anti-acne moisturizer', category: 'Face care', size: '100 g', priceKSh: 1500 },
  { id: 'p-43', name: 'Retinol moisturizer', category: 'Face care', size: '100 g', priceKSh: 1500 },
  { id: 'p-44', name: 'Kojic moisturizer', category: 'Face care', size: '100 g', priceKSh: 1500 },
  { id: 'p-45', name: 'Vitamin C moisturizer', category: 'Face care', size: '100 g', priceKSh: 1500 },
  { id: 'p-46', name: 'Sunscreen SPF50', category: 'Face care', size: '50 ml', priceKSh: 1350 },
  { id: 'p-47', name: 'Niacinamide cream', category: 'Face care', size: '100 g', priceKSh: 2000 },
  { id: 'p-48', name: 'Nila mask', category: 'Face care', size: '50 g', priceKSh: 800 },

  // Body & hands
  { id: 'p-49', name: 'Whipped body butter', category: 'Body & hands', size: '300 g', priceKSh: 1500 },
  { id: 'p-50', name: 'Ceramide moisturizer', category: 'Body & hands', size: '300 g', priceKSh: 2800 },
  { id: 'p-51', name: 'Aurora brightening cream', category: 'Body & hands', size: '300 g', priceKSh: 2800 },
  { id: 'p-52', name: 'Brightening body butter cream', category: 'Body & hands', size: '300 g', priceKSh: 2000 },
  { id: 'p-53', name: 'Hand cream (travel)', category: 'Body & hands', size: '100 ml', priceKSh: 600 },
  { id: 'p-54', name: 'Anti-aging cream', category: 'Body & hands', size: '300 g', priceKSh: 1500 },
  { id: 'p-55', name: 'Hand cream (luxury)', category: 'Body & hands', size: 'Regular', priceKSh: 1000 },
  { id: 'p-56', name: 'Brightening body butter (jumbo)', category: 'Body & hands', size: '500 ml', priceKSh: 3000 },

  // Scrubs & powders
  { id: 'p-57', name: 'Brightening face scrub', category: 'Scrubs & powders', size: '300 g', priceKSh: 1500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-58', name: 'Kojic scrub', category: 'Scrubs & powders', size: '300 g', priceKSh: 1500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-59', name: 'Oshaprapra body scrub', category: 'Scrubs & powders', size: '300 g', priceKSh: 1500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-60', name: 'Coffee brightening scrub', category: 'Scrubs & powders', size: '300 g', priceKSh: 1500, image: '/public/oshaprapra_scrub.jpg', isAuthenticPhoto: true },
  { id: 'p-61', name: 'Flawless powder', category: 'Scrubs & powders', size: '100 g', priceKSh: 1500, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },
  { id: 'p-62', name: 'Nila powder', category: 'Scrubs & powders', size: '10 g', priceKSh: 500, image: '/src/assets/images/product_organic_range_1793681736162.jpg' },

  // Lip care & extras
  { id: 'p-63', name: 'Pink lip balm', category: 'Lip care & extras', size: '10 g', priceKSh: 400 },
  { id: 'p-64', name: 'Pink lip scrub', category: 'Lip care & extras', size: '85 g', priceKSh: 850 },
  { id: 'p-65', name: 'V gel', category: 'Lip care & extras', size: 'Regular', priceKSh: 2500 },
  { id: 'p-66', name: 'Eyelashes', category: 'Lip care & extras', size: 'Pair', priceKSh: 1000 },
  { id: 'p-67', name: 'Pink perfect lip moisturizer', category: 'Lip care & extras', size: '10 g', priceKSh: 2000 },

  // Shampoo & treatments
  { id: 'p-68', name: 'Chebe clarifying shampoo', category: 'Shampoo & treatments', size: '250 ml', priceKSh: 1350 },
  { id: 'p-69', name: 'Rice protein leave-in conditioner', category: 'Shampoo & treatments', size: '250 ml', priceKSh: 1500 },
  { id: 'p-70', name: 'Hair brightening protein keratin deep treatment', category: 'Shampoo & treatments', size: '300 g', priceKSh: 1500 },
  { id: 'p-71', name: 'Chebe maxi hair growth', category: 'Shampoo & treatments', size: '300 g', priceKSh: 2200 },
  { id: 'p-72', name: 'Batana 2 in 1 shampoo', category: 'Shampoo & treatments', size: '500 g', priceKSh: 1500 },

  // Hair oils
  { id: 'p-73', name: 'Chebe oil', category: 'Hair oils', size: '120 ml', priceKSh: 1350 },
  { id: 'p-74', name: 'Karkar oil', category: 'Hair oils', size: '30 ml', priceKSh: 1359 },
  { id: 'p-75', name: '8 in 1 oil', category: 'Hair oils', size: '120 ml', priceKSh: 1300 },
  { id: 'p-76', name: 'Batana oil', category: 'Hair oils', size: '120 ml', priceKSh: 1500 },

  // Men's care
  { id: 'p-77', name: 'Men body lotion (120ml)', category: "Men's care", size: '120 ml', priceKSh: 1200 },
  { id: 'p-78', name: 'Beard cream', category: "Men's care", size: '100 g', priceKSh: 1290 },
  { id: 'p-79', name: 'Beard oil', category: "Men's care", size: '30 ml', priceKSh: 1000 },
  { id: 'p-80', name: 'Men body lotion (500ml)', category: "Men's care", size: '500 ml', priceKSh: 4500 }
];

export const BAREGLOW_SERVICES: CatalogService[] = [
  // SPA & BODY
  { id: 's-1', name: 'Swedish massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '1 hr', priceKSh: 2500 },
  { id: 's-2', name: 'Deep tissue massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '1 hr', priceKSh: 3000 },
  { id: 's-3', name: 'Back massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '30 mins', priceKSh: 1000 },
  { id: 's-4', name: 'Leg massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '30 mins', priceKSh: 500 },
  { id: 's-5', name: 'Head massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '20 mins', priceKSh: 500 },
  { id: 's-6', name: 'Hot stone massage', department: 'SPA & BODY', subCategory: 'Massage', duration: '75 mins', priceKSh: 3500 },
  
  // Body scrubs & rituals
  { id: 's-7', name: 'Full body scrub', department: 'SPA & BODY', subCategory: 'Body scrubs & rituals', duration: '45 mins', priceKSh: 1500 },
  { id: 's-8', name: 'Hanunam Bath', department: 'SPA & BODY', subCategory: 'Body scrubs & rituals', duration: '60 mins', priceKSh: 3500 },
  { id: 's-9', name: 'Golden oshaprapra treatment', department: 'SPA & BODY', subCategory: 'Body scrubs & rituals', duration: '60 mins', priceKSh: 3500 },
  { id: 's-10', name: 'Golden Hanunam treatment', department: 'SPA & BODY', subCategory: 'Body scrubs & rituals', duration: '75 mins', priceKSh: 3500 },

  // Waxing
  { id: 's-11', name: 'Arm waxing', department: 'SPA & BODY', subCategory: 'Waxing', duration: '30 mins', priceKSh: 700 },
  { id: 's-12', name: 'Bikini waxing', department: 'SPA & BODY', subCategory: 'Waxing', duration: '30 mins', priceKSh: 1500 },
  { id: 's-13', name: 'Brazilian waxing', department: 'SPA & BODY', subCategory: 'Waxing', duration: '45 mins', priceKSh: 2000 },
  { id: 's-14', name: 'Chest waxing', department: 'SPA & BODY', subCategory: 'Waxing', duration: '30 mins', priceKSh: 1000 },
  { id: 's-15', name: 'Face waxing', department: 'SPA & BODY', subCategory: 'Waxing', duration: '20 mins', priceKSh: 1000 },

  // Wood therapy & Contouring
  { id: 's-16', name: 'Wood therapy (Arms)', department: 'SPA & BODY', subCategory: 'Wood therapy', duration: '30 mins', priceKSh: 1500 },
  { id: 's-17', name: 'Wood therapy (Thighs)', department: 'SPA & BODY', subCategory: 'Wood therapy', duration: '45 mins', priceKSh: 2500 },
  { id: 's-18', name: 'Wood therapy (Tummy)', department: 'SPA & BODY', subCategory: 'Wood therapy', duration: '45 mins', priceKSh: 2500 },
  { id: 's-19', name: 'Breast enhancement', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '45 mins', priceKSh: 2000 },
  { id: 's-20', name: 'Butt enhancement', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '45 mins', priceKSh: 2500 },
  { id: 's-21', name: 'Fat cavitation', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '60 mins', priceKSh: 3500 },
  { id: 's-22', name: 'Fat freezing', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '60 mins', priceKSh: 7000 },
  { id: 's-23', name: 'Fat freezing arm', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '60 mins', priceKSh: 10000 },
  { id: 's-24', name: 'Fat freezing thighs', department: 'SPA & BODY', subCategory: 'Body contouring', duration: '75 mins', priceKSh: 10000 },

  // NAILS & LASHES & FACIALS
  { id: 's-25', name: 'Gel Application', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '30 mins', priceKSh: 500 },
  { id: 's-26', name: 'Classic Manicure', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '45 mins', priceKSh: 1000 },
  { id: 's-27', name: 'Classic Pedicure', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '60 mins', priceKSh: 1500 },
  { id: 's-28', name: 'Gel + Manicure', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '60 mins', priceKSh: 1500 },
  { id: 's-29', name: 'Gel + Pedicure', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '75 mins', priceKSh: 2000 },
  { id: 's-30', name: 'Stickons Nails', department: 'NAILS & LASHES', subCategory: 'Nail enhancements', duration: '45 mins', priceKSh: 1500 },
  { id: 's-31', name: 'Tips Nails', department: 'NAILS & LASHES', subCategory: 'Nail enhancements', duration: '60 mins', priceKSh: 2500 },
  { id: 's-32', name: 'Builder gel', department: 'NAILS & LASHES', subCategory: 'Nail enhancements', duration: '60 mins', priceKSh: 1500 },
  { id: 's-33', name: 'Gum gel', department: 'NAILS & LASHES', subCategory: 'Nail enhancements', duration: '75 mins', priceKSh: 3500 },
  { id: 's-34', name: 'Gel X', department: 'NAILS & LASHES', subCategory: 'Nail enhancements', duration: '75 mins', priceKSh: 3500 },
  { id: 's-35', name: 'Nail refill', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '45 mins', priceKSh: 1000 },
  { id: 's-36', name: 'Gel art', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '20 mins', priceKSh: 700 },
  { id: 's-37', name: 'Nail Polish', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '20 mins', priceKSh: 300 },
  { id: 's-38', name: 'Gel Removal', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '20 mins', priceKSh: 300 },
  { id: 's-39', name: 'Builder gel removal', department: 'NAILS & LASHES', subCategory: 'Nail care', duration: '30 mins', priceKSh: 500 },

  // Lashes
  { id: 's-40', name: 'Classic lashes', department: 'NAILS & LASHES', subCategory: 'Lashes', duration: '60 mins', priceKSh: 2500 },
  { id: 's-41', name: 'Mega lashes', department: 'NAILS & LASHES', subCategory: 'Lashes', duration: '90 mins', priceKSh: 3500 },
  { id: 's-42', name: 'Volume lashes', department: 'NAILS & LASHES', subCategory: 'Lashes', duration: '75 mins', priceKSh: 3000 },
  { id: 's-43', name: 'Lashes treatment', department: 'NAILS & LASHES', subCategory: 'Lashes', duration: '30 mins', priceKSh: 1000 },

  // Facials & Steaming
  { id: 's-44', name: 'Face scrub', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '30 min', priceKSh: 1000 },
  { id: 's-45', name: 'Organic Facial', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '40 min', priceKSh: 1500 },
  { id: 's-46', name: 'Hydrojelly facial', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '45 min', priceKSh: 3500 },
  { id: 's-47', name: 'Hydro facial', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '1 hr', priceKSh: 5000 },
  { id: 's-48', name: 'Gommage mask', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '45 mins', priceKSh: 3000 },
  { id: 's-49', name: 'Moroccan mask', department: 'NAILS & LASHES', subCategory: 'Facials', duration: '45 mins', priceKSh: 2500 },
  { id: 's-50', name: 'Full body steaming', department: 'NAILS & LASHES', subCategory: 'Steaming', duration: '30 mins', priceKSh: 1000 },

  // HAIR STYLING
  { id: 's-51', name: 'Micro small knotless braids', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '4 hrs', priceKSh: 4000 },
  { id: 's-52', name: 'Small knotless braids', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '3.5 hrs', priceKSh: 3000 },
  { id: 's-53', name: 'Medium knotless braids', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '3 hrs', priceKSh: 2500 },
  { id: 's-54', name: 'Large knotless braids', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '2 hrs', priceKSh: 2000 },
  { id: 's-55', name: 'Makeba small', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '2.5 hrs', priceKSh: 1500 },
  { id: 's-56', name: 'Makeba medium', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '2 hrs', priceKSh: 1000 },
  { id: 's-57', name: 'Fulani braids', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '3.5 hrs', priceKSh: 3000 },
  { id: 's-58', name: 'Spanish braids small', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '3.5 hrs', priceKSh: 3500 },
  { id: 's-59', name: 'Spanish braids medium', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '3 hrs', priceKSh: 2500 },
  { id: 's-60', name: 'Twist out', department: 'HAIR STYLING', subCategory: 'Braiding / knotless', duration: '2 hrs', priceKSh: 1500 },
  { id: 's-61', name: 'Lines small', department: 'HAIR STYLING', subCategory: 'Lines', duration: '1 hr', priceKSh: 500 },
  { id: 's-62', name: 'Lines medium', department: 'HAIR STYLING', subCategory: 'Lines', duration: '45 mins', priceKSh: 300 },
  { id: 's-63', name: 'Abuja lines small', department: 'HAIR STYLING', subCategory: 'Lines', duration: '2.5 hrs', priceKSh: 2500 },
  { id: 's-64', name: 'Abuja lines medium', department: 'HAIR STYLING', subCategory: 'Lines', duration: '2 hrs', priceKSh: 1500 },
  { id: 's-65', name: 'Wig bond repair', department: 'HAIR STYLING', subCategory: 'Wigs', duration: '45 mins', priceKSh: 1000 },
  { id: 's-66', name: 'Wig flat iron', department: 'HAIR STYLING', subCategory: 'Wigs', duration: '45 mins', priceKSh: 1500 },
  { id: 's-67', name: 'Wig tong / curls', department: 'HAIR STYLING', subCategory: 'Wigs', duration: '60 mins', priceKSh: 2000 },
  { id: 's-68', name: 'Wig installation', department: 'HAIR STYLING', subCategory: 'Wigs', duration: '90 mins', priceKSh: 3000 },
  { id: 's-69', name: 'Matuta (Small)', department: 'HAIR STYLING', subCategory: 'Matuta', duration: '90 mins', priceKSh: 1000 },
  { id: 's-70', name: 'Matuta (Medium)', department: 'HAIR STYLING', subCategory: 'Matuta', duration: '60 mins', priceKSh: 800 },
  { id: 's-71', name: 'Matuta (Large)', department: 'HAIR STYLING', subCategory: 'Matuta', duration: '45 mins', priceKSh: 600 },
  { id: 's-72', name: 'Undoing braids', department: 'HAIR STYLING', subCategory: 'Undoing', duration: '60 mins', priceKSh: 500 },
  { id: 's-73', name: 'Undoing matuta', department: 'HAIR STYLING', subCategory: 'Undoing', duration: '30 mins', priceKSh: 300 },

  // HAIR CARE & CHEMICALS
  { id: 's-74', name: 'Mega growth deep treatment', department: 'HAIR CARE', subCategory: 'Deep treatment', duration: '45 mins', priceKSh: 1200 },
  { id: 's-75', name: 'Mayonnaise hair treatment', department: 'HAIR CARE', subCategory: 'Deep treatment', duration: '45 mins', priceKSh: 1500 },
  { id: 's-76', name: 'Olive hair treatment', department: 'HAIR CARE', subCategory: 'Deep treatment', duration: '45 mins', priceKSh: 1500 },
  { id: 's-77', name: 'Mizani deep treatment', department: 'HAIR CARE', subCategory: 'Deep treatment', duration: '60 mins', priceKSh: 2000 },
  { id: 's-78', name: 'Leave-in treatment (Ours)', department: 'HAIR CARE', subCategory: 'Leave-in treatment', duration: '30 mins', priceKSh: 1200 },
  { id: 's-79', name: 'Rice & protein treatment', department: 'HAIR CARE', subCategory: 'Leave-in treatment', duration: '30 mins', priceKSh: 1200 },
  { id: 's-80', name: 'Mikalla treatment', department: 'HAIR CARE', subCategory: 'Leave-in treatment', duration: '30 mins', priceKSh: 1200 },
  { id: 's-81', name: 'Cantu treatment', department: 'HAIR CARE', subCategory: 'Leave-in treatment', duration: '30 mins', priceKSh: 1200 },
  { id: 's-82', name: 'Olive chemical relaxer', department: 'HAIR CARE', subCategory: 'Chemical / retouch', duration: '60 mins', priceKSh: 2500 },
  { id: 's-83', name: 'Beautiful beginning retouch', department: 'HAIR CARE', subCategory: 'Chemical / retouch', duration: '60 mins', priceKSh: 2000 },
  { id: 's-84', name: 'Mega growth retouch', department: 'HAIR CARE', subCategory: 'Chemical / retouch', duration: '60 mins', priceKSh: 2000 },
  { id: 's-85', name: 'Virginia Retouch', department: 'HAIR CARE', subCategory: 'Chemical / retouch', duration: '75 mins', priceKSh: 3000 },
  { id: 's-86', name: 'Hair Colour (Ours)', department: 'HAIR CARE', subCategory: 'Colour', duration: '90 mins', priceKSh: 3000 },
  { id: 's-87', name: 'Dye package complete', department: 'HAIR CARE', subCategory: 'Colour', duration: '90 mins', priceKSh: 3000 },
  { id: 's-88', name: 'Wash & blow-dry (Kids)', department: 'HAIR CARE', subCategory: 'Wash & blow-dry', duration: '30 mins', priceKSh: 600 },
  { id: 's-89', name: 'Wash & blow-dry (Adults)', department: 'HAIR CARE', subCategory: 'Wash & blow-dry', duration: '45 mins', priceKSh: 800 },

  // BEAUTY & BARBER
  { id: 's-90', name: 'Eyebrow Threading', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '15 mins', priceKSh: 500 },
  { id: 's-91', name: 'Tweezing', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '15 mins', priceKSh: 300 },
  { id: 's-92', name: 'Face threading', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '30 mins', priceKSh: 1000 },
  { id: 's-93', name: 'Eyebrows shaping', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '15 mins', priceKSh: 200 },
  { id: 's-94', name: 'Hot comb press', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '45 mins', priceKSh: 1500 },
  { id: 's-95', name: 'Brush blow-dry', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '30 mins', priceKSh: 1000 },
  { id: 's-96', name: 'Wash & set', department: 'BEAUTY & BARBER', subCategory: 'Beauty', duration: '45 mins', priceKSh: 1000 },
  
  // Barber
  { id: 's-97', name: 'Adult Haircut & Style', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '30 mins', priceKSh: 700 },
  { id: 's-98', name: 'Adult Bald Shave', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '20 mins', priceKSh: 500 },
  { id: 's-99', name: 'Adult Type C Shave', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '40 mins', priceKSh: 1000 },
  { id: 's-100', name: 'Beard shave & groom', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '20 mins', priceKSh: 300 },
  { id: 's-101', name: 'Shave + dye (black shampoo)', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '45 mins', priceKSh: 1000 },
  { id: 's-102', name: 'Shave + dye (creme of nature)', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '45 mins', priceKSh: 1500 },
  { id: 's-103', name: 'Build with foam', department: 'BEAUTY & BARBER', subCategory: 'Barber | adults', duration: '30 mins', priceKSh: 1000 },
  { id: 's-104', name: 'Kids Haircut Style', department: 'BEAUTY & BARBER', subCategory: 'Barber | kids', duration: '25 mins', priceKSh: 400 },
  { id: 's-105', name: 'Kids Bald Shave', department: 'BEAUTY & BARBER', subCategory: 'Barber | kids', duration: '20 mins', priceKSh: 300 }
];
