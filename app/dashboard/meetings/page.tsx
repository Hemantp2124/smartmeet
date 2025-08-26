'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import { Calendar, Clock, Search, Filter, ArrowLeft, Plus } from 'lucide-react';

// Mock data for meetings
const allMeetings = [
  {
    id: 1,
    title: 'Product Strategy Review',
    date: 'Today, 2:30 PM',
    duration: '45 min',
    status: 'completed',
    participants: 8,
  },
  {
    id: 2,
    title: 'Marketing Campaign Planning',
    date: 'Yesterday, 10:00 AM',
    duration: '60 min',
    status: 'completed',
    participants: 5,
  },
  {
    id: 3,
    title: 'Team Standup',
    date: 'Dec 15, 9:00 AM',
    duration: '30 min',
    status: 'completed',
    participants: 12,
  },
  {
    id: 4,
    title: 'Sprint Planning',
    date: 'Dec 14, 11:00 AM',
    duration: '60 min',
    status: 'completed',
    participants: 6,
  },
  {
    id: 5,
    title: 'Client Demo',
    date: 'Dec 13, 3:00 PM',
    duration: '45 min',
    status: 'completed',
    participants: 4,
  },
  {
    id: 6,
    title: 'Retrospective',
    date: 'Dec 10, 2:00 PM',
    duration: '60 min',
    status: 'completed',
    participants: 10,
  },
];

export default function MeetingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredMeetings = allMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        meeting.participants.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    // In a real app, you would implement more sophisticated date filtering
    const matchesDate = dateFilter === 'all' || true; 
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white mb-2"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <h1 className="text-2xl font-bold">All Meetings</h1>
            <p className="text-gray-400">View and manage all your meeting recordings</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/meetings/new')}
            className="gradient-button px-4 py-2 text-sm"
          >
            <Plus size={16} className="mr-2" />
            New Meeting
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/20 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/20 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-3">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No meetings found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="glass-card cursor-pointer hover:ring-2 hover:ring-purple-500/30 transition-all"
                  onClick={() => router.push(`/dashboard/meetings/${meeting.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{meeting.title}</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{meeting.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{meeting.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        meeting.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {meeting.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
