'use client';

import AccomplishmentList from '../components/AccomplishmentList';
import RemainingTaskList from '../components/RemainingTaskList';

interface SummaryTabProps {
  summary: string;
  accomplishments: string[];
  tasks: {
    task: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress';
  }[];
}

export default function SummaryTab({ summary, accomplishments, tasks }: SummaryTabProps) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="glass-card">
        <h3 className="text-xl font-semibold mb-4">Executive Summary</h3>
        <p className="text-gray-300 leading-relaxed">{summary}</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        <AccomplishmentList items={accomplishments} />
        <RemainingTaskList tasks={tasks} />
      </div>
    </div>
  );
}
