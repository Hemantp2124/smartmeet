import { Meeting } from './types';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import MeetingDetailClient from './MeetingDetailClient';

// Mock data - in a real app, this would come from an API or database
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Strategy Review',
    date: '2025-08-05T14:30:00',
    duration: '45 min',
    status: 'completed',
    participants: 8,
    agenda: 'Discuss the Q3 product roadmap and strategy for the upcoming features and improvements.',
    recordingUrl: 'https://example.com/recording/1',
    transcript: 'Meeting transcript will appear here...',
    actionItems: [
      { id: 1, text: 'Finalize Q3 roadmap', assignedTo: 'John Doe', dueDate: '2025-08-12' },
      { id: 2, text: 'Prepare feature requirements', assignedTo: 'Jane Smith', dueDate: '2025-08-10' },
    ],
  },
  {
    id: '2',
    title: 'Marketing Campaign Planning',
    date: '2025-08-04T10:00:00',
    duration: '60 min',
    status: 'completed',
    participants: 5,
    agenda: 'Plan the upcoming marketing campaign for the new product launch.',
    recordingUrl: 'https://example.com/recording/2',
    transcript: 'Meeting transcript will appear here...',
    actionItems: [
      { id: 1, text: 'Create campaign assets', assignedTo: 'Alex Johnson', dueDate: '2025-08-15' },
    ],
  },
];

// This function tells Next.js which paths to pre-render at build time
export async function generateStaticParams() {
  // In a real app, you would fetch this from your API
  // For now, we'll use the mock data
  return [
    { id: '1' },  // Product Strategy Review
    { id: '2' },  // Marketing Campaign Planning
    { id: '3' },  // Team Standup
    { id: '4' },  // Add more IDs as needed
  ];
}

// Get meeting data by ID
function getMeetingById(id: string): Meeting | undefined {
  return mockMeetings.find((meeting) => meeting.id === id);
}

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const meeting = getMeetingById(params.id);

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Meeting Not Found</h2>
          <p className="text-gray-400 mb-6">The requested meeting could not be found.</p>
          <a 
            href="/dashboard/meetings" 
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
          >
            Back to Meetings
          </a>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <MeetingDetailClient meeting={meeting} />
    </DashboardLayout>
  );
}
