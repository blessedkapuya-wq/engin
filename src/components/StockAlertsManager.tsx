import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Package,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { InventoryItem } from '../types/salon';

interface StockAlertsManagerProps {
  inventory: InventoryItem[];
  onUpdateInventory: (updated: InventoryItem[]) => void;
}

export default function StockAlertsManager({ inventory, onUpdateInventory }: StockAlertsManagerProps) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('low'); // Default to low stock alert!
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);

  const categories = ['All', ...new Set(inventory.map((item) => item.category))];

  // Stock alerts: items with stock <= 3 (requested by user: "STOCK ALERT IF THE PRODUCT ARE BELOW 3")
  const lowStockItems = inventory.filter((item) => item.stockQuantity <= 3 && item.stockQuantity > 0);
  const outOfStockItems = inventory.filter((item) => item.stockQuantity === 0);
  const totalAlertsCount = lowStockItems.length + outOfStockItems.length;

  // Filtered inventory for display
  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (filterMode === 'low') {
      return matchesCategory && matchesSearch && item.stockQuantity <= 3;
    }
    if (filterMode === 'out') {
      return matchesCategory && matchesSearch && item.stockQuantity === 0;
    }
    return matchesCategory && matchesSearch;
  });

  const handleAdjustStock = (id: string, delta: number) => {
    const updated = inventory.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.stockQuantity + delta);
        return { ...item, stockQuantity: newQty };
      }
      return item;
    });
    onUpdateInventory(updated);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem) return;
    handleAdjustStock(restockModalItem.id, restockAmount);
    setRestockModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* ⚠️ CRITICAL STOCK ALERT BANNER (If any products < 3) */}
      {totalAlertsCount > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-700 text-white rounded-2xl p-5 shadow-lg border border-red-500 animate-pulse-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs">
                <AlertTriangle className="w-6 h-6 text-amber-200" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-wide">
                  ⚠️ STOCK ALERT: {totalAlertsCount} Product{totalAlertsCount > 1 ? 's' : ''} Below 3 Units!
                </h3>
                <p className="text-xs text-red-100">
                  Salon inventory reorder threshold is 3 units. Restock immediately to prevent service disruptions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFilterMode('low');
                  setSearch('');
                }}
                className="px-4 py-2 bg-white text-red-900 text-xs font-bold rounded-xl shadow-xs hover:bg-red-50 transition-colors cursor-pointer"
              >
                View Low Stock Items ({lowStockItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Strip & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Total Catalog Products</span>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">{inventory.length}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">80 Bareglow Skincare & Haircare</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Total Units in Salon</span>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {inventory.reduce((sum, item) => sum + item.stockQuantity, 0)} units
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Active retail & backbar inventory</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-amber-900 font-bold block">⚠️ Low Stock Alert (&le; 3 units)</span>
          <span className="text-2xl font-bold font-mono text-amber-950 tabular-nums">
            {lowStockItems.length}
          </span>
          <span className="text-[10px] text-amber-800 block mt-0.5">Requires urgent restocking</span>
        </div>

        <div className="bg-red-50/70 border border-red-300 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-red-900 font-bold block">Out of Stock (0 units)</span>
          <span className="text-2xl font-bold font-mono text-red-950 tabular-nums">
            {outOfStockItems.length}
          </span>
          <span className="text-[10px] text-red-800 block mt-0.5">Cannot be sold</span>
        </div>
      </div>

      {/* Main Inventory Management Table */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
        {/* Header & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Bareglow Salon Inventory & Stock Alert Book</h2>
            <p className="text-xs text-stone-500">Live unit counts with instant restock buttons and &lt; 3 warning alerts.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter mode segmented buttons */}
            <div className="flex p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setFilterMode('low')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'low'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ⚠️ Below 3 ({lowStockItems.length})
              </button>
              <button
                onClick={() => setFilterMode('out')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'out'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Out of Stock ({outOfStockItems.length})
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Products ({inventory.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="border border-stone-200 rounded-lg overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
              <tr>
                <th className="p-3 w-16">Photo</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3 text-right">Price (KSh)</th>
                <th className="p-3 text-center">Stock Level</th>
                <th className="p-3 text-center">Status / Alert</th>
                <th className="p-3 text-right">Adjust Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isCritical = item.stockQuantity <= 3 && item.stockQuantity > 0;
                  const isOut = item.stockQuantity === 0;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50/70 transition-colors ${
                        isOut ? 'bg-red-50/40' : isCritical ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="p-2">
                        <img
                          src={item.image || '/src/assets/images/product_organic_range_1793681736162.jpg'}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md border border-stone-200 bg-stone-100"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.isAuthenticPhoto && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                              Authentic
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-stone-500">{item.category}</td>
                      <td className="p-3 text-stone-600 font-mono text-[11px]">{item.size}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-900 tabular-nums">
                        KSh {item.priceKSh.toLocaleString()}
                      </td>

                      {/* Stock Level */}
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono text-sm font-bold tabular-nums px-2.5 py-1 rounded-md ${
                            isOut
                              ? 'bg-red-100 text-red-900'
                              : isCritical
                              ? 'bg-amber-100 text-amber-950 font-black ring-1 ring-amber-400'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {item.stockQuantity} units
                        </span>
                      </td>

                      {/* Status / Alert */}
                      <td className="p-3 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" /> OUT OF STOCK
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-400 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-900" /> ALERT: Stock &lt; 3
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Adequate ({item.stockQuantity})
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleAdjustStock(item.id, -1)}
                            disabled={item.stockQuantity === 0}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-stone-200 disabled:opacity-30 cursor-pointer"
                            title="Deduct 1 unit (Sale)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-stone-200 cursor-pointer"
                            title="Add 1 unit"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setRestockModalItem(item);
                              setRestockAmount(10);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 ml-1 cursor-pointer"
                          >
                            + Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Batch Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900">Restock Salon Product</h3>
              <button
                onClick={() => setRestockModalItem(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-stone-500 block">Product:</span>
                <span className="font-bold text-stone-900 text-sm">{restockModalItem.name}</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Current Stock: <strong className="font-mono text-red-700">{restockModalItem.stockQuantity} units</strong>
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Units to Add *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-950 cursor-pointer"
                >
                  Confirm Restock (+{restockAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
