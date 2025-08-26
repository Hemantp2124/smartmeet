'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import { LucideLink, Calendar, Clock, Play, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import Link from 'next/link';
import AudioUploader from '@/app/components/dashboard/ai/AudioUploader';

// Import real API functions
import {
  transcribeAudio,
  generateSummary,
  generateCode,
  testCode,
  generateDocumentation
} from '@/lib/api/audio/service';

const recentMeetings = [
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
    status: 'processing',
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
];

export default function HomePage() {
  const [meetingLink, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!meetingLink.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success('Meeting analysis started!');
      setMeetingLink('');
    }, 1500);
  };

  const handleAudioUpload = async (file: File) => {
    try {
      toast.loading('Processing audio...');
      
      // 1. Transcribe audio
      const transcriptionResponse = await transcribeAudio(file);
      const transcription = transcriptionResponse.transcription || transcriptionResponse.text || 'Transcription failed';
      toast.success('Transcription complete!');
      
      // 2. Generate summary
      toast.loading('Generating summary...');
      const summary = await generateSummary(transcription);
      
      // 3. Generate code
      toast.loading('Generating code...');
      const code = await generateCode(transcription);
      
      // 4. Test code
      toast.loading('Running tests...');
      const testResults = await testCode(code.code || code);
      
      // 5. Generate documentation
      toast.loading('Generating documentation...');
      const documentation = await generateDocumentation(code.code || code);
      
      // 6. Save results (you'll need to implement this)
      const result = {
        id: `audio_${Date.now()}`,
        filename: file.name,
        transcription: transcription,
        summary,
        code: code.code || code,
        testResults,
        documentation,
        timestamp: new Date().toISOString()
      };
      
      // Save to state or context here if needed
      // For now, just show success
      toast.success('Audio processing complete!');
      
      // Redirect to results page
      // router.push(`/dashboard/audio/results/${result.id}`);
      
    } catch (error) {
      console.error('Audio processing failed:', error);
      toast.error('Failed to process audio. Please try again.');
    } finally {
      toast.dismiss();
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 sm:space-y-8 px-2 sm:px-0">
        {/* Greeting */}
        <div className="text-center py-3 sm:py-6 md:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">Welcome back, Alex! 👋</h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Ready to make your next meeting smarter?</p>
        </div>

        {/* Dual Actions: Meeting + Audio Upload */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Meeting Link Analysis */}
          <div className="glass p-6 rounded-2xl h-full">
            <h2 className="text-xl font-semibold mb-6 text-center text-white">Start a New Meeting Analysis</h2>
            <div className="space-y-6">
              <div className="relative">
                <LucideLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Paste your Google Meet link here..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    setMeetingLink(pastedText);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && meetingLink.trim()) handleStart();
                  }}
                  className="w-full bg-white/5 border border-white/10 text-white py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleStart}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  !meetingLink.trim() || loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 transform hover:-translate-y-0.5'
                }`}
                disabled={!meetingLink.trim() || loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Meeting Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Audio Upload */}
          <div className="glass-card h-full">
            <h2 className="text-xl font-semibold mb-6 text-center">Generate Code from Audio</h2>
            <AudioUploader onUpload={handleAudioUpload} />
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Meetings</h2>
            <button 
              onClick={() => router.push('/dashboard/meetings')}
              className="glass-button"
            >
              View All
              <ArrowRight className="inline ml-2" size={16} />
            </button>
          </div>

          {recentMeetings.length === 0 ? (
            <p className="text-center text-gray-400">No recent meetings found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="glass-card group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                        {meeting.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{meeting.duration}</span>
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {meeting.participants} participants
                    </span>
                    <Link href={`/dashboard/summary/${meeting.id}`} className="glass-button text-sm">
                      View Summary
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card text-center">
            <CountUp end={24} duration={1.2} className="text-2xl font-bold text-purple-400 mb-1" />
            <div className="text-sm text-gray-400">Meetings This Month</div>
          </div>
          <div className="glass-card text-center">
            <CountUp end={18} duration={1.2} suffix="h" className="text-2xl font-bold text-pink-400 mb-1" />
            <div className="text-sm text-gray-400">Time Saved</div>
          </div>
          <div className="glass-card text-center">
            <CountUp end={156} duration={1.2} className="text-2xl font-bold text-blue-400 mb-1" />
            <div className="text-sm text-gray-400">Action Items</div>
          </div>
          <div className="glass-card text-center">
            <CountUp end={89} duration={1.2} suffix="%" className="text-2xl font-bold text-green-400 mb-1" />
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}