'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { Bag } from '@/store/useAppStore';

interface BagCardProps {
  bag: Bag;
  showVerifiedBadge?: boolean;
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

export default function BagCard({ bag, showVerifiedBadge = true }: BagCardProps) {
  return (
    <motion.a
      href={bag.affiliate_link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-900 transition-all shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={springConfig}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] mb-4 bg-slate-50 rounded-xl overflow-hidden">
        {bag.image_url && (
          <Image
            src={bag.image_url}
            alt={bag.name}
            fill
            className="object-cover"
          />
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
        <h3 className="font-bold text-slate-900 leading-tight line-clamp-2">
          {bag.name}
        </h3>

        {/* Dimensions */}
        <p className="text-xs text-slate-600">
          {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xl font-bold text-slate-900">
            ${bag.estimated_price}
          </span>
          <div className="flex items-center gap-1 text-slate-600 group-hover:text-slate-900 text-xs font-semibold transition-colors">
            <span>View</span>
            <ExternalLink size={14} />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
