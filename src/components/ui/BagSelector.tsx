'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, Ruler, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useAppStore, type Bag } from '@/store/useAppStore';
import { searchBags } from '@/lib/bagFilters';

interface BagSelectorProps {
  bags: Bag[];
}

type InputMode = 'search' | 'manual';
type Unit = 'in' | 'cm';

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export default function BagSelector({ bags }: BagSelectorProps) {
  const { selectedBag, customDimensions, setSelectedBag, setCustomDimensions } = useAppStore();

  const [mode, setMode] = useState<InputMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [unit, setUnit] = useState<Unit>('in');
  const [manualDims, setManualDims] = useState({ h: '', w: '', d: '' });

  // Fuzzy search with Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(bags, {
      keys: ['name', 'brand', 'description'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [bags]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return bags.slice(0, 8);
    const results = fuse.search(searchQuery);
    return results.slice(0, 8).map(result => result.item);
  }, [searchQuery, fuse, bags]);

  const handleBagSelect = (bag: Bag) => {
    setSelectedBag(bag);
    setSearchQuery('');
  };

  const handleManualSubmit = () => {
    const h = parseFloat(manualDims.h);
    const w = parseFloat(manualDims.w);
    const d = parseFloat(manualDims.d);

    if (!isNaN(h) && !isNaN(w) && !isNaN(d) && h > 0 && w > 0 && d > 0) {
      setCustomDimensions({ h, w, d, unit });
    }
  };

  const handleClear = () => {
    setSelectedBag(null);
    setCustomDimensions(null);
    setSearchQuery('');
    setManualDims({ h: '', w: '', d: '' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Briefcase className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Your Bag</h2>
            <p className="text-lg font-bold text-slate-900">Search or Enter Dimensions</p>
          </div>
        </div>
        {(selectedBag || customDimensions) && (
          <button
            onClick={handleClear}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Clear selection"
          >
            <X className="text-slate-400" size={20} />
          </button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          onClick={() => setMode('search')}
          className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            mode === 'search'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Search size={16} />
            <span>Search Bags</span>
          </div>
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
            mode === 'manual'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Ruler size={16} />
            <span>Manual Input</span>
          </div>
        </button>
      </div>

      {/* Search Mode */}
      {mode === 'search' && (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by brand or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Selected Bag Display */}
          {selectedBag && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{selectedBag.name}</p>
                  {selectedBag.brand && (
                    <p className="text-xs text-slate-600 mb-2">{selectedBag.brand}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white rounded-lg text-xs font-semibold text-slate-700">
                      {selectedBag.dimensions.h}" × {selectedBag.dimensions.w}" × {selectedBag.dimensions.d}"
                    </span>
                    <span className="px-2 py-1 bg-white rounded-lg text-xs font-semibold text-slate-700 capitalize">
                      {selectedBag.material}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          {searchQuery && !selectedBag && (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((bag, index) => (
                  <motion.button
                    key={bag.id}
                    onClick={() => handleBagSelect(bag)}
                    className="w-full p-3 bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 rounded-xl transition-all text-left"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <p className="font-bold text-slate-900 text-sm mb-1">{bag.name}</p>
                    {bag.brand && (
                      <p className="text-xs text-slate-600 mb-2">{bag.brand}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-slate-700">
                        {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
                      </span>
                      <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-slate-700 capitalize">
                        {bag.material}
                      </span>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">No bags found. Try a different search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual Input Mode */}
      {mode === 'manual' && (
        <div className="space-y-4">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Unit</p>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('in')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  unit === 'in'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  unit === 'cm'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Custom Dimensions Display */}
          {customDimensions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl"
            >
              <p className="text-sm font-semibold text-slate-700 mb-2">Your Bag Dimensions</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-900">
                  H: {customDimensions.h}{customDimensions.unit}
                </span>
                <span className="px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-900">
                  W: {customDimensions.w}{customDimensions.unit}
                </span>
                <span className="px-3 py-2 bg-white rounded-lg text-sm font-bold text-slate-900">
                  D: {customDimensions.d}{customDimensions.unit}
                </span>
              </div>
            </motion.div>
          )}

          {/* Dimension Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Height ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={manualDims.h}
                onChange={(e) => setManualDims({ ...manualDims, h: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Width ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={manualDims.w}
                onChange={(e) => setManualDims({ ...manualDims, w: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Depth ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={manualDims.d}
                onChange={(e) => setManualDims({ ...manualDims, d: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-center font-semibold"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleManualSubmit}
            disabled={!manualDims.h || !manualDims.w || !manualDims.d}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Check Dimensions
          </button>
        </div>
      )}
    </div>
  );
}
