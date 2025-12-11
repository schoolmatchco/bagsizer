'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface AirlineSelectorProps {
  onSelect: (airline: any) => void;
}

/**
 * AirlineSelector - Searchable modal with airline logos
 * Uses spring physics for smooth animations
 */
export default function AirlineSelector({ onSelect }: AirlineSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
    >
      <h2 className="text-2xl font-bold mb-4">Select Your Airline</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search airlines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {/* Airline list will be implemented here */}
        <p className="text-gray-500 text-center py-8">
          Airline selection coming soon
        </p>
      </div>
    </motion.div>
  );
}
