'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ShoppingBag, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Plane className="text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">BagSizer.io</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Will your bag fit? Find out before you get to the gate.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Airline Selection */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowAirlines(!showAirlines)}
            whileHover={{ scale: 1.02 }}
            transition={springConfig}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Plane size={24} className="text-blue-600" />
                Select Airline
              </h2>
              {selectedAirline && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
            </div>

            {selectedAirline ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative flex items-center justify-center bg-gray-50 rounded-lg p-2">
                  <Image
                    src={selectedAirline.logo}
                    alt={selectedAirline.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedAirline.name}</p>
                  <p className="text-sm text-gray-600">
                    Gate check fee: ${selectedAirline.fees.gate_check}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click to choose your airline</p>
            )}
          </motion.div>

          {/* Bag Selection */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowBags(!showBags)}
            whileHover={{ scale: 1.02 }}
            transition={springConfig}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag size={24} className="text-blue-600" />
                Select Bag
              </h2>
              {selectedBag && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
            </div>

            {selectedBag ? (
              <div>
                <p className="font-semibold text-lg">{selectedBag.name}</p>
                <p className="text-sm text-gray-600 mb-2">{selectedBag.description}</p>
                <p className="text-xs text-gray-500">
                  {selectedBag.dimensions.h}" × {selectedBag.dimensions.w}" × {selectedBag.dimensions.d}" • {selectedBag.material}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Click to choose your bag</p>
            )}
          </motion.div>
        </div>

        {/* Sizer Type Toggle */}
        {selectedAirline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <p className="text-sm text-gray-600 mb-3">I want to use this bag as:</p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedSizerType('personal')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  selectedSizerType === 'personal'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Personal Item
              </button>
              <button
                onClick={() => setSelectedSizerType('carry_on')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  selectedSizerType === 'carry_on'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Carry-On
              </button>
            </div>
          </motion.div>
        )}

        {/* Compliance Result */}
        <AnimatePresence>
          {compliance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springConfig}
              className={`rounded-2xl shadow-xl p-8 ${
                compliance.passes
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400'
              }`}
            >
              <div className="flex items-start gap-6">
                {compliance.passes ? (
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={48} />
                ) : (
                  <XCircle className="text-red-600 flex-shrink-0" size={48} />
                )}

                <div className="flex-1">
                  <h3 className={`text-3xl font-bold mb-3 ${compliance.passes ? 'text-green-900' : 'text-red-900'}`}>
                    {compliance.passes ? '✓ Your bag fits!' : '✗ Your bag is too big'}
                  </h3>
                  <p className={`text-lg mb-4 ${compliance.passes ? 'text-green-800' : 'text-red-800'}`}>
                    {compliance.reason}
                  </p>

                  {!compliance.passes && selectedAirline && selectedAirline.fees.gate_check > 0 && (
                    <div className="bg-white bg-opacity-70 rounded-lg p-4 mb-4">
                      <p className="font-semibold text-red-900 flex items-center gap-2">
                        <AlertCircle size={20} />
                        Potential gate-check fee: ${selectedAirline.fees.gate_check}
                      </p>
                    </div>
                  )}

                  {/* Dimension Details */}
                  <div className="bg-white bg-opacity-70 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">Dimension Comparison:</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Height</p>
                        <p className="font-mono">
                          <span className={compliance.marginOfError!.h > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            {selectedBag?.dimensions.h}"
                          </span>
                          {' / '}
                          <span className="text-gray-700">
                            {selectedAirline?.sizers[selectedSizerType].h}"
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Width</p>
                        <p className="font-mono">
                          <span className={compliance.marginOfError!.w > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            {selectedBag?.dimensions.w}"
                          </span>
                          {' / '}
                          <span className="text-gray-700">
                            {selectedAirline?.sizers[selectedSizerType].w}"
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Depth</p>
                        <p className="font-mono">
                          <span className={compliance.marginOfError!.d > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            {selectedBag?.dimensions.d}"
                          </span>
                          {' / '}
                          <span className="text-gray-700">
                            {selectedAirline?.sizers[selectedSizerType].d}"
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Airline Selection Modal */}
        <AnimatePresence>
          {showAirlines && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAirlines(false)}
              />
              <motion.div
                className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-2xl shadow-2xl z-50 overflow-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={springConfig}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                  <h3 className="text-2xl font-bold">Select Your Airline</h3>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {airlines.map((airline) => (
                    <motion.button
                      key={airline.id}
                      onClick={() => {
                        setSelectedAirline(airline);
                        setShowAirlines(false);
                      }}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                      whileHover={{ scale: 1.05 }}
                      transition={springConfig}
                    >
                      <div className="w-full h-16 relative flex items-center justify-center mb-3 bg-gray-50 rounded-lg p-2">
                        <Image
                          src={airline.logo}
                          alt={airline.name}
                          width={80}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="font-semibold text-center">{airline.name}</p>
                      <p className="text-xs text-center text-gray-600 mt-1">
                        Fee: ${airline.fees.gate_check}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bag Selection Modal */}
        <AnimatePresence>
          {showBags && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBags(false)}
              />
              <motion.div
                className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-2xl shadow-2xl z-50 overflow-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={springConfig}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                  <h3 className="text-2xl font-bold">Select Your Bag</h3>
                </div>
                <div className="p-6 space-y-3">
                  {bags.map((bag) => (
                    <motion.button
                      key={bag.id}
                      onClick={() => {
                        setSelectedBag(bag);
                        setShowBags(false);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      transition={springConfig}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{bag.name}</p>
                          <p className="text-sm text-gray-600 mb-2">{bag.description}</p>
                          <p className="text-xs text-gray-500">
                            {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}" • {bag.material}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">${bag.estimated_price}</p>
                          <div className="flex gap-1 mt-1">
                            {bag.categories.map((cat) => (
                              <span
                                key={cat}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
