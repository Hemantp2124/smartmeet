'use client';

import { FileText, Download } from 'lucide-react';

export default function TranscriptTab() {
  return (
    <div className="glass-card">
      <h3 className="text-xl font-semibold mb-4">Full Meeting Transcript</h3>
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 text-center border border-white/10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <FileText size={32} className="text-purple-400" />
        </div>
        <h4 className="text-lg font-medium mb-2">Full Transcript Available</h4>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Download the complete meeting transcript for your records or further analysis.</p>
        <button 
          onClick={() => {}}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 shadow-lg hover:shadow-purple-500/20"
        >
          <Download size={16} className="mr-2 transition-transform group-hover:scale-110" />
          <span>Download Full Transcript</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
          </span>
        </button>
      </div>
    </div>
  );
}
