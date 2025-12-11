'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComplianceCardProps {
  passes: boolean;
  reason: string;
  gateFee?: number;
}

/**
 * ComplianceCard - Red/Green output logic
 * Shows whether the bag passes or fails the compliance check
 */
export default function ComplianceCard({
  passes,
  reason,
  gateFee,
}: ComplianceCardProps) {
  const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <motion.div
      className={`p-6 rounded-lg ${
        passes ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springConfig}
    >
      <div className="flex items-start gap-4">
        {passes ? (
          <CheckCircle className="text-green-500 flex-shrink-0" size={32} />
        ) : (
          <XCircle className="text-red-500 flex-shrink-0" size={32} />
        )}

        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${passes ? 'text-green-800' : 'text-red-800'}`}>
            {passes ? 'Your bag fits!' : "Bag doesn't fit"}
          </h3>
          <p className={`${passes ? 'text-green-700' : 'text-red-700'}`}>
            {reason}
          </p>

          {!passes && gateFee && (
            <p className="mt-3 text-red-900 font-semibold">
              Potential gate-check fee: ${gateFee}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
