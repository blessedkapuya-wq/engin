import { useState } from 'react';
import { Search, X, Check, Plus } from 'lucide-react';
import { BAREGLOW_PRODUCTS, BAREGLOW_PRODUCT_CATEGORIES, CatalogProduct } from '../data/bareglowCatalog';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: CatalogProduct, quantity: number) => void;
}

export default function ProductPickerModal({ isOpen, onClose, onSelectProduct }: ProductPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const filteredProducts = BAREGLOW_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesQuery =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.category.toLowerCase().includes(search.toLowerCase()) ||
      prod.size.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  const handleAdd = (prod: CatalogProduct) => {
    const qty = quantities[prod.id] || 1;
    onSelectProduct(prod, qty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Bareglow Product Catalogue</h3>
            <p className="text-xs text-stone-500">Pick from 80 authentic Bareglow products to log into staff sales</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-stone-100 bg-white space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products by name, ingredient, or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {BAREGLOW_PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-amber-100 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              No products found matching &quot;{search}&quot;
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const qty = quantities[prod.id] || 1;
              return (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4 hover:bg-stone-50/70 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={prod.image || '/src/assets/images/product_organic_range_1793681736162.jpg'}
                      alt={prod.name}
                      className="w-11 h-11 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900 truncate">{prod.name}</span>
                        <span className="text-xs text-stone-500">· {prod.size}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        <span>{prod.category}</span>
                        <span className="mx-1.5">·</span>
                        <span className="font-semibold text-emerald-800 font-mono tabular-nums">
                          KSh {prod.priceKSh.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Add button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-stone-200 rounded-md bg-white">
                      <button
                        onClick={() => handleQuantityChange(prod.id, -1)}
                        className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-xs font-mono font-medium min-w-[24px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(prod.id, 1)}
                        className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-r-md"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAdd(prod)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Report
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filteredProducts.length} of 80 products</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
