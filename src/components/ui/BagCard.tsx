'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import type { Bag } from '@/store/useAppStore';

interface BagCardProps {
  bag: Bag;
  showVerifiedBadge?: boolean;
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export default function BagCard({ bag, showVerifiedBadge = true }: BagCardProps) {
  return (
    <motion.a
      href={bag.affiliate_link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-lg"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] mb-3 bg-slate-50 rounded-xl overflow-hidden">
        {bag.image_url && (
          <Image
            src={bag.image_url}
            alt={bag.name}
            fill
            className="object-cover"
          />
        )}

        {/* Verified Badge */}
        {showVerifiedBadge && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
            <CheckCircle size={12} />
            <span>Perfect Fit</span>
          </div>
        )}

        {/* Commission Tier Indicator */}
        {bag.commission_tier === 'high' && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
            Recommended
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Brand */}
        {bag.brand && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {bag.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">
          {bag.name}
        </h3>

        {/* Dimensions */}
        <p className="text-xs text-slate-600">
          {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2">
          {bag.description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-lg font-extrabold text-blue-600">
            ${bag.estimated_price}
          </span>
          <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:text-blue-700">
            <span>View Deal</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
