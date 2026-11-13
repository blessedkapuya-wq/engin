import { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { BAREGLOW_SERVICES, CatalogService } from '../data/bareglowCatalog';

interface ServicePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: CatalogService) => void;
}

const DEPARTMENTS = [
  'All',
  'SPA & BODY',
  'NAILS & LASHES',
  'HAIR STYLING',
  'HAIR CARE',
  'BEAUTY & BARBER'
];

export default function ServicePickerModal({ isOpen, onClose, onSelectService }: ServicePickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  if (!isOpen) return null;

  const filteredServices = BAREGLOW_SERVICES.filter((srv) => {
    const matchesDept = selectedDept === 'All' || srv.department === selectedDept;
    const matchesQuery =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      srv.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Bareglow Service Catalog</h3>
            <p className="text-xs text-stone-500">Select services performed to append into your staff client log</p>
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
              placeholder="Search services (e.g., knotless braids, swedish massage, hydro facial)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          {/* Department tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-emerald-900 text-amber-100 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Service List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              No services found matching &quot;{search}&quot;
            </div>
          ) : (
            filteredServices.map((srv) => (
              <div key={srv.id} className="py-3 flex items-center justify-between gap-4 hover:bg-stone-50/70 px-2 rounded-lg transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900 truncate">{srv.name}</span>
                    {srv.duration && <span className="text-xs text-stone-500">· {srv.duration}</span>}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    <span>{srv.department}</span>
                    <span className="mx-1.5">/</span>
                    <span>{srv.subCategory}</span>
                    <span className="mx-1.5">·</span>
                    <span className="font-semibold text-emerald-800 font-mono tabular-nums">
                      KSh {srv.priceKSh.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(srv)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Select
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filteredServices.length} services</span>
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
