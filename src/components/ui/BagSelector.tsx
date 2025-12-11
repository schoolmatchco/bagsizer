'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Ruler } from 'lucide-react';
import Fuse from 'fuse.js';
import { useAppStore, type Bag } from '@/store/useAppStore';

interface BagSelectorProps {
  bags: Bag[];
}

type InputMode = 'search' | 'manual';
type Unit = 'in' | 'cm';

const springConfig = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
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
    if (!searchQuery.trim()) return [];
    const results = fuse.search(searchQuery);
    return results.slice(0, 5).map(result => result.item);
  }, [searchQuery, fuse]);

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

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
      {/* Mode Toggle */}
      <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1 mb-8">
        <button
          onClick={() => setMode('search')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            mode === 'search'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search size={16} />
            <span>Search Bag</span>
          </div>
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            mode === 'manual'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Ruler size={16} />
            <span>Enter Dimensions</span>
          </div>
        </button>
      </div>

      {/* Search Mode */}
      {mode === 'search' && (
        <div className="space-y-6">
          {/* Selected Bag Display */}
          {selectedBag ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg mb-1">{selectedBag.name}</p>
                  {selectedBag.brand && (
                    <p className="text-sm text-slate-600 mb-3">{selectedBag.brand}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">
                      {selectedBag.dimensions.h}" × {selectedBag.dimensions.w}" × {selectedBag.dimensions.d}"
                    </span>
                    <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 capitalize">
                      {selectedBag.material}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBag(null)}
                  className="text-sm text-slate-500 hover:text-slate-900 underline"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by brand or bag name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((bag) => (
                    <motion.button
                      key={bag.id}
                      onClick={() => handleBagSelect(bag)}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-900 rounded-2xl transition-all text-left"
                      whileHover={{ x: 4 }}
                      transition={springConfig}
                    >
                      <p className="font-bold text-slate-900 mb-1">{bag.name}</p>
                      {bag.brand && (
                        <p className="text-xs text-slate-600 mb-2">{bag.brand}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">
                          {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-600 capitalize">{bag.material}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-sm text-slate-500">No bags found. Try entering dimensions manually.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Manual Input Mode */}
      {mode === 'manual' && (
        <div className="space-y-6">
          {/* Custom Dimensions Display */}
          {customDimensions ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Your bag dimensions</p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-white rounded-xl text-base font-bold text-slate-900 border border-slate-200">
                      {customDimensions.h}{customDimensions.unit}
                    </span>
                    <span className="text-slate-400">×</span>
                    <span className="px-4 py-2 bg-white rounded-xl text-base font-bold text-slate-900 border border-slate-200">
                      {customDimensions.w}{customDimensions.unit}
                    </span>
                    <span className="text-slate-400">×</span>
                    <span className="px-4 py-2 bg-white rounded-xl text-base font-bold text-slate-900 border border-slate-200">
                      {customDimensions.d}{customDimensions.unit}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCustomDimensions(null)}
                  className="text-sm text-slate-500 hover:text-slate-900 underline"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Unit Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Measurement unit</p>
                <div className="inline-flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setUnit('in')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      unit === 'in'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      unit === 'cm'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Dimension Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualDims.h}
                    onChange={(e) => setManualDims({ ...manualDims, h: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-center text-lg font-semibold"
                  />
                  <p className="text-xs text-slate-500 text-center mt-1">{unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualDims.w}
                    onChange={(e) => setManualDims({ ...manualDims, w: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-center text-lg font-semibold"
                  />
                  <p className="text-xs text-slate-500 text-center mt-1">{unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Depth
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={manualDims.d}
                    onChange={(e) => setManualDims({ ...manualDims, d: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-center text-lg font-semibold"
                  />
                  <p className="text-xs text-slate-500 text-center mt-1">{unit}</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleManualSubmit}
                disabled={!manualDims.h || !manualDims.w || !manualDims.d}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-2xl transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Check Dimensions
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
