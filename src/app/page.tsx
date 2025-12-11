'use client';

import React from 'react';
import { Plane } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="text-blue-600" size={48} />
            <h1 className="text-5xl font-bold text-gray-900">BagSizer.io</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize whether your luggage fits into airline baggage sizer bins.
            Avoid surprise gate-check fees.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome to BagSizer
            </h2>
            <p className="text-gray-600 mb-4">
              This is the initial setup of your BagSizer.io application. The following features are planned:
            </p>

            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Interactive bag and airline selection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Visual sizer comparison with 60FPS animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Real-time compliance checking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Smart bag recommendations with affiliate links</span>
              </li>
            </ul>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Project initialized and ready for development</p>
          </div>
        </div>
      </div>
    </main>
  );
}
