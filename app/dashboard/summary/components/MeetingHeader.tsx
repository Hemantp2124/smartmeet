'use client';
import { Calendar, Clock, Users, Share } from 'lucide-react';
import { MeetingData } from '../types';

export default function MeetingHeader({ data }: { data: MeetingData }) {
  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{data.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{data.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{data.participants.length} participants</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            {data.status}
          </div>
          <button 
            onClick={() => {}}
            className="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-gray-900/50 overflow-hidden"
          >
            <Share size={16} className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
            <span>Share</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
