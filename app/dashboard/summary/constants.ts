import { MeetingData, TranscriptEntry, ActionItem } from './types';

export const meetingData: MeetingData = {
  title: 'Product Strategy Review Q4 2024',
  date: 'December 18, 2024',
  time: '2:30 PM - 3:15 PM',
  duration: '45 min',
  participants: ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'David Park'],
  status: 'completed',
};

export const transcript: TranscriptEntry[] = [
  { speaker: 'Alex Johnson', time: '2:30', text: "Good afternoon everyone..." },
  { speaker: 'Sarah Chen', time: '2:32', text: "Absolutely. Our user engagement..." },
];

export const keyPoints: string[] = [
  'User engagement increased by 23% in Q4',
  'Mobile experience improvements are top priority',
  'Next sprint cycle will focus on retention features',
  'User feedback data shows positive sentiment',
  'Technical implementation timeline confirmed',
];

export const actionItems: ActionItem[] = [
  { task: 'Finalize mobile UX wireframes', assignee: 'Emma Thompson', due: 'Dec 22, 2024' },
];
