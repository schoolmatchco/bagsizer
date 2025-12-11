'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import BagCard from './BagCard';
import { getVerifiedBags } from '@/lib/bagFilters';
import type { Airline, Bag } from '@/store/useAppStore';

interface VerifiedBagGridProps {
  airline: Airline;
  sizerType: 'personal' | 'carry_on';
  bags: Bag[];
  maxBags?: number;
}

export default function VerifiedBagGrid({
  airline,
  sizerType,
  bags,
  maxBags = 3,
}: VerifiedBagGridProps) {
  const verifiedBags = getVerifiedBags(bags, airline, sizerType, maxBags);

  if (verifiedBags.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 text-slate-300" size={40} />
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            No verified bags available
          </h3>
          <p className="text-sm text-slate-500">
            We don't have any bags verified to fit {airline.name}'s{' '}
            {sizerType === 'personal' ? 'personal item' : 'carry-on'} sizer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Verified to fit {airline.name}
        </h3>
        <p className="text-sm text-slate-500">
          {verifiedBags.length} bags with 0.5" safety margin
        </p>
      </div>

      {/* Bags Grid */}
      <div className="space-y-4">
        {verifiedBags.map((bag, index) => (
          <motion.div
            key={bag.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BagCard bag={bag} showVerifiedBadge={true} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
