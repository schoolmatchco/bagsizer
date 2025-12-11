'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
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
  maxBags = 6,
}: VerifiedBagGridProps) {
  const verifiedBags = getVerifiedBags(bags, airline, sizerType, maxBags);

  if (verifiedBags.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 text-slate-300" size={48} />
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            No Verified Bags Available
          </h3>
          <p className="text-sm text-slate-500">
            We don't have any bags verified to fit {airline.name}'s{' '}
            {sizerType === 'personal' ? 'personal item' : 'carry-on'} sizer at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-200 rounded-full">
          <CheckCircle className="text-emerald-600" size={20} />
          <span className="text-sm font-bold text-emerald-700">
            Verified to Fit {airline.name}
          </span>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Mobile: Horizontal Scroll Carousel */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {verifiedBags.map((bag, index) => (
            <motion.div
              key={bag.id}
              className="flex-shrink-0 w-[280px] snap-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BagCard bag={bag} showVerifiedBadge={true} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xs text-slate-500 text-center">
        All bags shown include a 0.5" safety margin and are sorted by commission tier
      </p>
    </div>
  );
}
