'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Briefcase, CheckCircle, XCircle, Info } from 'lucide-react';
import { useAppStore, type Airline, type Bag } from '@/store/useAppStore';
import { checkCompliance } from '@/lib/complianceEngine';
import Image from 'next/image';

// Import data
import airlinesData from '@/data/airlines.json';
import bagsData from '@/data/bags.json';

const airlines = airlinesData as Airline[];
const bags = bagsData as Bag[];

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export default function Home() {
  const {
    selectedAirline,
    selectedBag,
    selectedSizerType,
    setSelectedAirline,
    setSelectedBag,
    setSelectedSizerType,
  } = useAppStore();

  const [showAirlines, setShowAirlines] = useState(false);
  const [showBags, setShowBags] = useState(false);

  // Calculate compliance
  const compliance = selectedAirline && selectedBag
    ? checkCompliance(
        selectedBag,
        selectedAirline.sizers[selectedSizerType]
      )
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Plane className="text-white" size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BagSizer
              </h1>
            </div>
            <p className="text-lg text-slate-600 font-medium">
              Check if your bag fits before you reach the gate
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Avoid surprise fees up to $99
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Main Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Airline Card */}
          <motion.button
            onClick={() => setShowAirlines(true)}
            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-300 text-left"
            whileHover={{ y: -4 }}
            transition={springConfig}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                  <Plane className="text-blue-600" size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Step 1</h2>
                  <p className="text-xl font-bold text-slate-900">Choose Airline</p>
                </div>
              </div>
              {selectedAirline && (
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              )}
            </div>

            {selectedAirline ? (
              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                <div className="w-16 h-16 relative flex items-center justify-center bg-white rounded-xl p-2 shadow-sm">
                  <Image
                    src={selectedAirline.logo}
                    alt={selectedAirline.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{selectedAirline.name}</p>
                  <p className="text-sm text-slate-600">
                    {selectedAirline.fees.gate_check > 0
                      ? `Gate fee: $${selectedAirline.fees.gate_check}`
                      : 'No gate fees'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 font-medium">Click to select</p>
              </div>
            )}
          </motion.button>

          {/* Bag Card */}
          <motion.button
            onClick={() => setShowBags(true)}
            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-300 text-left"
            whileHover={{ y: -4 }}
            transition={springConfig}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                  <Briefcase className="text-indigo-600" size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Step 2</h2>
                  <p className="text-xl font-bold text-slate-900">Choose Bag</p>
                </div>
              </div>
              {selectedBag && (
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              )}
            </div>

            {selectedBag ? (
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="font-bold text-slate-900 mb-1">{selectedBag.name}</p>
                <p className="text-sm text-slate-600 mb-3">{selectedBag.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-white rounded-full text-slate-700 font-medium">
                    {selectedBag.dimensions.h}" × {selectedBag.dimensions.w}" × {selectedBag.dimensions.d}"
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-slate-700 font-medium capitalize">
                    {selectedBag.material}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 font-medium">Click to select</p>
              </div>
            )}
          </motion.button>
        </div>

        {/* Sizer Type Selection */}
        <AnimatePresence>
          {selectedAirline && selectedBag && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springConfig}
              className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 mb-8"
            >
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Step 3: Bag Type</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSizerType('personal')}
                  className={`py-4 px-6 rounded-2xl font-bold transition-all ${
                    selectedSizerType === 'personal'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Personal Item
                </button>
                <button
                  onClick={() => setSelectedSizerType('carry_on')}
                  className={`py-4 px-6 rounded-2xl font-bold transition-all ${
                    selectedSizerType === 'carry_on'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Carry-On
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {compliance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springConfig}
              className={`rounded-3xl p-8 shadow-xl ${
                compliance.passes
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200'
                  : 'bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl ${compliance.passes ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {compliance.passes ? (
                    <CheckCircle className="text-emerald-600" size={40} strokeWidth={2.5} />
                  ) : (
                    <XCircle className="text-rose-600" size={40} strokeWidth={2.5} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`text-3xl font-extrabold mb-2 ${compliance.passes ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {compliance.passes ? 'Perfect Fit!' : 'Too Large'}
                  </h3>
                  <p className={`text-lg mb-6 ${compliance.passes ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {compliance.reason}
                  </p>

                  {/* Fee Warning */}
                  {!compliance.passes && selectedAirline && selectedAirline.fees.gate_check > 0 && (
                    <div className="bg-white/80 backdrop-blur rounded-2xl p-5 mb-6 border border-rose-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 rounded-xl">
                          <Info className="text-rose-600" size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-rose-900">Gate-Check Fee</p>
                          <p className="text-2xl font-extrabold text-rose-600">
                            ${selectedAirline.fees.gate_check}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dimension Breakdown */}
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-slate-200">
                    <p className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
                      Dimension Check
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Height', bag: selectedBag?.dimensions.h, sizer: selectedAirline?.sizers[selectedSizerType].h, margin: compliance.marginOfError!.h },
                        { label: 'Width', bag: selectedBag?.dimensions.w, sizer: selectedAirline?.sizers[selectedSizerType].w, margin: compliance.marginOfError!.w },
                        { label: 'Depth', bag: selectedBag?.dimensions.d, sizer: selectedAirline?.sizers[selectedSizerType].d, margin: compliance.marginOfError!.d },
                      ].map((dim) => (
                        <div key={dim.label} className="text-center">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            {dim.label}
                          </p>
                          <div className="space-y-1">
                            <p className={`text-2xl font-bold ${dim.margin > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {dim.bag}"
                            </p>
                            <p className="text-xs text-slate-500">limit: {dim.sizer}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Message */}
        {!selectedAirline || !selectedBag ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
              <Info className="text-blue-600" size={16} />
              <p className="text-sm text-slate-600 font-medium">
                Select an airline and bag to check compatibility
              </p>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Airline Modal */}
      <AnimatePresence>
        {showAirlines && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAirlines(false)}
            />
            <motion.div
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springConfig}
            >
              <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-2xl font-extrabold text-slate-900">Select Your Airline</h3>
                <p className="text-sm text-slate-600 mt-1">Choose from {airlines.length} airlines</p>
              </div>
              <div className="overflow-auto p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {airlines.map((airline) => (
                    <motion.button
                      key={airline.id}
                      onClick={() => {
                        setSelectedAirline(airline);
                        setShowAirlines(false);
                      }}
                      className="group p-5 bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl transition-all text-center"
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springConfig}
                    >
                      <div className="w-full h-20 relative flex items-center justify-center mb-4 bg-white rounded-xl p-3 group-hover:shadow-md transition-shadow">
                        <Image
                          src={airline.logo}
                          alt={airline.name}
                          width={80}
                          height={50}
                          className="object-contain"
                        />
                      </div>
                      <p className="font-bold text-slate-900 mb-1">{airline.name}</p>
                      <p className="text-xs text-slate-600">
                        {airline.fees.gate_check > 0 ? `$${airline.fees.gate_check} fee` : 'No fees'}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bag Modal */}
      <AnimatePresence>
        {showBags && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBags(false)}
            />
            <motion.div
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springConfig}
            >
              <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
                <h3 className="text-2xl font-extrabold text-slate-900">Select Your Bag</h3>
                <p className="text-sm text-slate-600 mt-1">Choose from {bags.length} bag options</p>
              </div>
              <div className="overflow-auto p-6">
                <div className="space-y-3">
                  {bags.map((bag) => (
                    <motion.button
                      key={bag.id}
                      onClick={() => {
                        setSelectedBag(bag);
                        setShowBags(false);
                      }}
                      className="group w-full p-5 bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl transition-all text-left"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springConfig}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-lg mb-1">{bag.name}</p>
                          <p className="text-sm text-slate-600 mb-3">{bag.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                              {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
                            </span>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-200 capitalize">
                              {bag.material}
                            </span>
                            {bag.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-3 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-700"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-indigo-600">
                            ${bag.estimated_price}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
