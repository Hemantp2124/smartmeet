'use client';

import { ArrowRight } from 'lucide-react';

export default function CTAButton() {
  return (
    <div className="text-center mt-10">
      <button 
        onClick={() => {}}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 shadow-lg hover:shadow-purple-500/30 overflow-hidden"
      >
        <span className="relative z-10 flex items-center">
          Generate Full Report
          <ArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" size={20} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </button>
    </div>
  );
}
