'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface AlternativeBagProps {
  bag: {
    id: string;
    name: string;
    dimensions: {
      h: number;
      w: number;
      d: number;
    };
    estimated_price: number;
    affiliate_link: string;
  };
  reason: string;
}

/**
 * AlternativeBag - "Fix It" recommendation card
 * Displays affiliate bag recommendations when the selected bag doesn't fit
 */
export default function AlternativeBag({ bag, reason }: AlternativeBagProps) {
  const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <motion.div
      className="p-6 bg-blue-50 border-2 border-blue-500 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
    >
      <h3 className="text-xl font-bold mb-2 text-blue-900">
        Try this bag instead
      </h3>

      <p className="text-blue-700 mb-4">{reason}</p>

      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-lg mb-2">{bag.name}</h4>
        <p className="text-gray-600 text-sm mb-2">
          Dimensions: {bag.dimensions.h}" × {bag.dimensions.w}" × {bag.dimensions.d}"
        </p>
        <p className="text-blue-900 font-bold text-lg">
          ${bag.estimated_price.toFixed(2)}
        </p>
      </div>

      <a
        href={bag.affiliate_link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        View on Amazon
        <ExternalLink size={18} />
      </a>
    </motion.div>
  );
}
