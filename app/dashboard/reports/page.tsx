'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import { FileText, TrendingUp, Users, Download, Send, Calendar, Clock } from 'lucide-react';

import { reportData, executiveSummary, keyAccomplishments, remainingTasks, meetingSnippets } from './constants';
import { Tab } from './types';
import TabSwitcher from './components/TabSwitcher';
import ReportHeader from './components/ReportHeader';
import SummaryTab from './tabs/SummaryTab';
import SnippetsTab from './tabs/SnippetsTab';
import TranscriptTab from './tabs/TranscriptTab';

const tabs: Tab[] = [
  { id: 'summary', label: 'Executive Summary', icon: FileText },
  { id: 'snippets', label: 'Key Snippets', icon: TrendingUp },
  { id: 'transcript', label: 'Full Transcript', icon: Users }
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab['id']>('summary');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <ReportHeader data={reportData} />

        {/* Tabs */}
        <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <SummaryTab
            summary={executiveSummary}
            accomplishments={keyAccomplishments}
            tasks={remainingTasks}
          />
        )}

        {activeTab === 'snippets' && (
          <SnippetsTab snippets={meetingSnippets} />
        )}

        {activeTab === 'transcript' && <TranscriptTab />}
      </div>
    </DashboardLayout>
  );
}
