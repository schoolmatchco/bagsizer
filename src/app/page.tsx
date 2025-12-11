'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useAppStore, type Airline, type Bag } from '@/store/useAppStore';
import { checkCompliance } from '@/lib/complianceEngine';
import Image from 'next/image';
import BagSelector from '@/components/ui/BagSelector';
import VerifiedBagGrid from '@/components/ui/VerifiedBagGrid';

// Import data
import airlinesData from '@/data/airlines.json';
import bagsData from '@/data/bags.json';

const airlines = airlinesData as Airline[];
const bags = bagsData as Bag[];

const springConfig = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

export default function Home() {
  const {
    selectedAirline,
    selectedBag,
    customDimensions,
    selectedSizerType,
    setSelectedAirline,
    setSelectedSizerType,
  } = useAppStore();

  const [showAirlines, setShowAirlines] = useState(false);

  // Determine the bag dimensions to check (from selected bag OR custom dimensions)
  const bagToCheck = selectedBag || (customDimensions ? {
    dimensions: customDimensions,
    material: 'soft' as const,
  } : null);

  // Calculate compliance
  const compliance = selectedAirline && bagToCheck
    ? checkCompliance(
        bagToCheck as Bag,
        selectedAirline.sizers[selectedSizerType]
      )
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Plane className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-slate-900">BagSizer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!selectedAirline && (
        <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Find the perfect bag for your flight<br />or check if yours fits
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Avoid surprise fees up to $99. Get verified bag recommendations or check your bag against airline size requirements.
          </p>
          <button
            onClick={() => setShowAirlines(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Get started for free
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Main Content */}
      {selectedAirline && (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Airline Selection Card */}
          <motion.button
            onClick={() => setShowAirlines(true)}
            className="w-full bg-white rounded-3xl p-8 mb-8 shadow-sm hover:shadow-md transition-all border border-slate-200 text-left"
            whileHover={{ y: -2 }}
            transition={springConfig}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 relative flex items-center justify-center bg-slate-50 rounded-2xl p-3">
                  <Image
                    src={selectedAirline.logo}
                    alt={selectedAirline.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Flying with</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedAirline.name}</p>
                  {selectedAirline.fees.gate_check > 0 && (
                    <p className="text-sm text-slate-600 mt-1">
                      Gate check fee: ${selectedAirline.fees.gate_check}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="text-slate-400" size={24} />
            </div>
          </motion.button>

          {/* Sizer Type Toggle */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 mb-4">Bag type</p>
            <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setSelectedSizerType('personal')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedSizerType === 'personal'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personal Item
              </button>
              <button
                onClick={() => setSelectedSizerType('carry_on')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  selectedSizerType === 'carry_on'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Carry-On
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Left: Bag Checker */}
            <div className="space-y-8">
              <BagSelector bags={bags} />

              {/* Compliance Results */}
              <AnimatePresence mode="wait">
                {compliance && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={springConfig}
                    className={`rounded-3xl p-8 shadow-sm border-2 ${
                      compliance.passes
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl ${
                        compliance.passes ? 'bg-emerald-100' : 'bg-rose-100'
                      }`}>
                        {compliance.passes ? (
                          <CheckCircle className="text-emerald-600" size={32} strokeWidth={2.5} />
                        ) : (
                          <XCircle className="text-rose-600" size={32} strokeWidth={2.5} />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-3xl font-bold mb-2 ${
                          compliance.passes ? 'text-emerald-900' : 'text-rose-900'
                        }`}>
                          {compliance.passes ? 'Perfect Fit!' : 'Too Large'}
                        </h3>
                        <p className={`text-lg mb-6 ${
                          compliance.passes ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {compliance.reason}
                        </p>

                        {/* Dimension Grid */}
                        <div className="grid grid-cols-3 gap-4 bg-white/60 rounded-2xl p-6">
                          {[
                            { label: 'Height', bag: bagToCheck!.dimensions.h, sizer: selectedAirline.sizers[selectedSizerType].h, margin: compliance.marginOfError!.h },
                            { label: 'Width', bag: bagToCheck!.dimensions.w, sizer: selectedAirline.sizers[selectedSizerType].w, margin: compliance.marginOfError!.w },
                            { label: 'Depth', bag: bagToCheck!.dimensions.d, sizer: selectedAirline.sizers[selectedSizerType].d, margin: compliance.marginOfError!.d },
                          ].map((dim) => (
                            <div key={dim.label} className="text-center">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                {dim.label}
                              </p>
                              <p className={`text-2xl font-bold mb-1 ${
                                dim.margin > 0 ? 'text-rose-600' : 'text-emerald-600'
                              }`}>
                                {dim.bag}"
                              </p>
                              <p className="text-xs text-slate-500">limit {dim.sizer}"</p>
                            </div>
                          ))}
                        </div>

                        {/* Fee Warning */}
                        {!compliance.passes && selectedAirline.fees.gate_check > 0 && (
                          <div className="mt-6 bg-white/80 rounded-2xl p-5 border border-rose-300">
                            <p className="text-sm font-semibold text-rose-900 mb-1">Gate check fee</p>
                            <p className="text-3xl font-bold text-rose-600">
                              ${selectedAirline.fees.gate_check}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Verified Bags (Sticky) */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <VerifiedBagGrid
                airline={selectedAirline}
                sizerType={selectedSizerType}
                bags={bags}
                maxBags={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Airline Modal */}
      <AnimatePresence>
        {showAirlines && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAirlines(false)}
            />
            <motion.div
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springConfig}
            >
              <div className="p-8 border-b border-slate-200">
                <h3 className="text-3xl font-bold text-slate-900">Select your airline</h3>
                <p className="text-slate-600 mt-2">Choose from {airlines.length} airlines worldwide</p>
              </div>
              <div className="overflow-auto p-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {airlines.map((airline) => (
                    <motion.button
                      key={airline.id}
                      onClick={() => {
                        setSelectedAirline(airline);
                        setShowAirlines(false);
                      }}
                      className="p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-900 rounded-2xl transition-all text-center"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springConfig}
                    >
                      <div className="w-full h-16 relative flex items-center justify-center mb-4">
                        <Image
                          src={airline.logo}
                          alt={airline.name}
                          width={64}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="font-bold text-slate-900">{airline.name}</p>
                      {airline.fees.gate_check > 0 && (
                        <p className="text-xs text-slate-500 mt-1">${airline.fees.gate_check} gate fee</p>
                      )}
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
