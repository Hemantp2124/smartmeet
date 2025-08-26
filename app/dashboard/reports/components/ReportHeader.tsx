'use client';

import { Calendar, Clock, Users, Download, Send } from 'lucide-react';
import { ReportData } from '../types';

interface ReportHeaderProps {
  data: ReportData;
}

export default function ReportHeader({ data }: ReportHeaderProps) {
  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Generated: {data.generatedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{data.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{data.participants} participants</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {}}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 shadow-lg hover:shadow-purple-500/20"
          >
            <Download size={16} className="flex-shrink-0" />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={() => {}}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-gray-900/50"
          >
            <Send size={16} className="flex-shrink-0" />
            <span>Send to Notion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
