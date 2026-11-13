import { useState } from 'react';
import {
  Scissors,
  ShoppingBag,
  Sparkles,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  X
} from 'lucide-react';
import {
  BAREGLOW_PRODUCTS,
  BAREGLOW_PRODUCT_CATEGORIES,
  BAREGLOW_SERVICES,
  SALON_INFO,
  CatalogProduct,
  CatalogService
} from '../data/bareglowCatalog';

interface ClientSalonViewProps {
  onOpenStaffForm: () => void;
  onOpenOwnerPortal: () => void;
}

export default function ClientSalonView({ onOpenStaffForm, onOpenOwnerPortal }: ClientSalonViewProps) {
  const [activeCatalogTab, setActiveCatalogTab] = useState<'services' | 'products'>('services');
  const [selectedServiceDept, setSelectedServiceDept] = useState<string>('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All');
  const [serviceSearch, setServiceSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Booking modal state
  const [bookingService, setBookingService] = useState<CatalogService | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const serviceDepartments = [
    'All',
    'SPA & BODY',
    'NAILS & LASHES',
    'HAIR STYLING',
    'HAIR CARE',
    'BEAUTY & BARBER'
  ];

  const filteredServices = BAREGLOW_SERVICES.filter((s) => {
    const matchesDept = selectedServiceDept === 'All' || s.department === selectedServiceDept;
    const matchesQuery =
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.subCategory.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const filteredProducts = BAREGLOW_PRODUCTS.filter((p) => {
    const matchesCat = selectedProductCategory === 'All' || p.category === selectedProductCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService) return;

    // Build WhatsApp booking link
    const text = encodeURIComponent(
      `Hello Bareglow Salon, I would like to book an appointment for ${bookingService.name} (KSh ${bookingService.priceKSh.toLocaleString()}) on ${bookingDate} at ${bookingTime}. My name is ${clientName} (${clientPhone}).`
    );
    const waUrl = `https://wa.me/254796134777?text=${text}`;
    window.open(waUrl, '_blank');
    setBookingSuccess(true);
  };

  const handleOrderProductWhatsApp = (prod: CatalogProduct) => {
    const text = encodeURIComponent(
      `Hello Bareglow Boutiques & Spa, I would like to order: ${prod.name} (${prod.size}) - KSh ${prod.priceKSh.toLocaleString()}. Please confirm availability and delivery details.`
    );
    window.open(`https://wa.me/254796134777?text=${text}`, '_blank');
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Top Welcome Bar */}
      <div className="bg-emerald-950 text-stone-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Links Road Nyali · Petrocity 2nd Floor, Mombasa
            </span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Mon-Sat: 8:30 AM - 7:30 PM · Sun: 10:00 AM - 5:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-amber-300">
              <CreditCard className="w-3.5 h-3.5" />
              M-PESA TILL: 9597237
            </span>
            <a
              href="https://wa.me/254796134777"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-200 transition-colors flex items-center gap-1 text-emerald-300 font-medium"
            >
              <Phone className="w-3 h-3" />
              WhatsApp: +254 796 134 777
            </a>
          </div>
        </div>
      </div>

      {/* Hero Showcase Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Hero Story */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/bareglow_logo_trimmed.png"
                  alt="Bareglow Logo"
                  className="h-12 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-xs font-semibold tracking-widest text-emerald-800 uppercase">
                The Bareglow Collection · Boutiques & Spa
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 leading-[1.15]">
                Beauty, care & your <span className="italic font-normal text-amber-800">radiant glow</span>.
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience restorative organic hair styling, clarifying facial rituals, holistic spa wellness, and over 80 pure botanical formulations handcrafted for radiant everyday beauty.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog-view"
                onClick={() => setActiveCatalogTab('services')}
                className="px-6 py-3 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Browse 105 Salon Services
              </a>

              <a
                href="#catalog-view"
                onClick={() => setActiveCatalogTab('products')}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop 80 Organic Products
              </a>

              <button
                onClick={onOpenStaffForm}
                className="px-5 py-3 border border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Staff Report Form &rarr;
              </button>
            </div>

            {/* Key Trust Strip */}
            <div className="pt-6 border-t border-stone-100 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-900 block font-mono text-base">100%</span>
                <span className="text-stone-500">Organic & Natural</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 block font-mono text-base">105+</span>
                <span className="text-stone-500">Curated Services</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 block font-mono text-base">M-Pesa</span>
                <span className="text-stone-500">Till 9597237</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_salon_interior_1793681735672.jpg"
              alt="Bareglow Boutique and Spa Interior"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold block">
                  Petrocity Second Floor · Nyali
                </span>
                <h3 className="text-base font-serif font-medium">Boutique Haven of Holistic Care</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Service Cards (Highlight 3 Key Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative">
                <img
                  src="/src/assets/images/service_facial_treatment_1793681735913.jpg"
                  alt="Organic Facial Ritual"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-emerald-950 font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  From KSh 1,000
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Spa & Botanical Facials</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hydro facial, Moroccan mask, Gommage rituals, and customized organic exfoliation for lasting glow.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCatalogTab('services');
                setSelectedServiceDept('SPA & BODY');
              }}
              className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 flex items-center gap-1"
            >
              Explore Spa Treatments &rarr;
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative">
                <img
                  src="/src/assets/images/service_hair_styling_1793681736482.jpg"
                  alt="Knotless Braids and Hair Styling"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-emerald-950 font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  From KSh 300
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Hair Styling & Knotless Braids</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Micro small, Fulani braids, Spanish styles, wig installation, and traditional matuta care.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCatalogTab('services');
                setSelectedServiceDept('HAIR STYLING');
              }}
              className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 flex items-center gap-1"
            >
              Explore Hair Services &rarr;
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative">
                <img
                  src="/public/oshaprapra_scrub.jpg"
                  alt="Bareglow Oshaprapra Whitening Body Scrub"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-950 font-mono text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  Authentic Formulation · 300g
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Handcrafted Organic Boutique</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Signature Oshaprapra whitening body scrub (300g), Batana oils, Niacinamide serums, and Chebe clarifying shampoo.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCatalogTab('products');
                setSelectedProductCategory('All');
              }}
              className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              Shop Full Collection &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Catalog Section */}
      <section id="catalog-view" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Catalog Top Segmented Switch */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Salon Catalog
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {activeCatalogTab === 'services' ? 'Services & Treatment Menu' : 'Product Collection (80 Items)'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setActiveCatalogTab('services')}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeCatalogTab === 'services'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Services (105)
                </button>
                <button
                  onClick={() => setActiveCatalogTab('products')}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeCatalogTab === 'products'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Products (80)
                </button>
              </div>
            </div>
          </div>

          {/* SERVICE CATALOG VIEW */}
          {activeCatalogTab === 'services' && (
            <div className="space-y-6">
              {/* Department Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {serviceDepartments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedServiceDept(dept)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                        selectedServiceDept === dept
                          ? 'bg-emerald-900 text-amber-100 font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Service Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 border border-stone-200 rounded-xl hover:border-emerald-700/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 bg-stone-50/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                          {srv.department} · {srv.subCategory}
                        </span>
                        {srv.duration && (
                          <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {srv.duration}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{srv.name}</h4>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-emerald-950 tabular-nums">
                        KSh {srv.priceKSh.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          setBookingService(srv);
                          setBookingSuccess(false);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT CATALOG VIEW */}
          {activeCatalogTab === 'products' && (
            <div className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {BAREGLOW_PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedProductCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                        selectedProductCategory === cat
                          ? 'bg-emerald-900 text-amber-100 font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search 80 products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Authentic Signature Spotlight Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-emerald-50/60 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 h-56 rounded-xl overflow-hidden relative shadow-md bg-stone-100 flex items-center justify-center">
                  <img
                    src="/public/oshaprapra_scrub.jpg"
                    alt="Authentic Oshaprapra Whitening Body Scrub 300g by Tinez Kapuya"
                    className="w-full h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-900 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    Official Photo · Handcrafted
                  </span>
                </div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-full">
                      Bareglow Signature Bestseller
                    </span>
                    <span className="text-xs text-stone-500">By Tinez Kapuya</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    Oshaprapra Whitening Body Scrub (300g)
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                    Formulated with natural organic exfoliating minerals, restorative botanicals, and brightening plant extracts. Gently buffs away dry surface cells to reveal velvety, luminously radiant skin without harsh chemical bleaching.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className="font-mono text-xl font-bold text-emerald-950">
                      KSh 1,500 <span className="text-xs text-stone-500 font-sans font-normal">/ 300g jar</span>
                    </div>
                    <button
                      onClick={() => handleOrderProductWhatsApp({
                        id: 'p-59',
                        name: 'Oshaprapra body scrub',
                        category: 'Scrubs & powders',
                        size: '300 g',
                        priceKSh: 1500,
                        image: '/public/oshaprapra_scrub.jpg',
                        isAuthenticPhoto: true
                      })}
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                      Order via WhatsApp
                    </button>
                    <span className="text-[11px] text-stone-500 font-medium">
                      M-Pesa Till: <strong className="text-stone-900 font-mono">9597237</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 border border-stone-200 rounded-xl hover:border-amber-600/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 bg-white"
                  >
                    <div>
                      {/* Product Image Thumbnail */}
                      <div className="h-36 rounded-lg overflow-hidden relative mb-2.5 bg-stone-50 border border-stone-100 flex items-center justify-center">
                        <img
                          src={prod.image || '/src/assets/images/product_organic_range_1793681736162.jpg'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {prod.isAuthenticPhoto && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-900/90 text-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase">
                            Authentic
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                        {prod.category}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 mt-0.5 line-clamp-1">{prod.name}</h4>
                      <span className="text-[11px] text-stone-500 font-mono block">
                        Size: {prod.size}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-emerald-950 tabular-nums">
                        KSh {prod.priceKSh.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleOrderProductWhatsApp(prod)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        title="Order via WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-700" />
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Catalog Ordering Callout matching the PDF */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>
                    <strong>Ready to order?</strong> Send the product name, size and quantity to WhatsApp <strong>+254 796 134 777</strong>. Our team confirms availability and collection or delivery.
                  </span>
                </div>
                <a
                  href="https://wa.me/254796134777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Chat with Bareglow Desk
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Appointment Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Book Salon Treatment</h3>
                <p className="text-xs text-stone-500">Bareglow Boutiques and Spa · Nyali Petrocity</p>
              </div>
              <button
                onClick={() => setBookingService(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-stone-900">Appointment Request Sent!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Your appointment booking has been routed to Bareglow on WhatsApp. Our reception team will confirm your slot and therapist.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setBookingService(null)}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-900 text-white rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900 block">{bookingService.name}</span>
                    <span className="text-stone-500 text-[11px]">{bookingService.department} · {bookingService.duration || 'Standard Session'}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 text-sm">
                    KSh {bookingService.priceKSh.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Joy Wambui"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Your Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Preferred Time *</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-white"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:30 PM">06:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingService(null)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-white bg-emerald-900 hover:bg-emerald-950 font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirm via WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
