'use client';

import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import { meetingData, transcript, keyPoints, actionItems } from './constants';
import MeetingHeader from './components/MeetingHeader';
import TranscriptList from './components/TranscriptList';
import KeyPointList from './components/KeyPointList';
import ActionItemList from './components/ActionItemList';
import CTAButton from './components/CTAButton';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';

export default function SummaryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MeetingHeader data={meetingData} />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play size={20} />
              Meeting Transcript
            </h2>
            <TranscriptList items={transcript} />
          </div>

          <div className="space-y-6">
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                Key Points
              </h3>
              <KeyPointList points={keyPoints} />
            </div>
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-400" />
                Action Items
              </h3>
              <ActionItemList items={actionItems} />
            </div>
          </div>
        </div>

        <CTAButton />
      </div>
    </DashboardLayout>
  );
}
