import { ReportData, Task, Snippet } from './types';

export const reportData: ReportData = {
  title: 'Product Strategy Review Q4 2024 - Final Report',
  generatedAt: 'December 18, 2024, 3:25 PM',
  meetingDate: 'December 18, 2024',
  duration: '45 minutes',
  participants: 5
};

export const executiveSummary = `
The Q4 Product Strategy Review meeting successfully addressed key performance metrics and future planning initiatives. 
The team demonstrated strong alignment on priorities, with user engagement metrics showing significant improvement at 23% growth quarter-over-quarter. 
Mobile experience optimization emerged as the primary focus area for the upcoming development cycle.
`;

export const keyAccomplishments: string[] = [
  'Achieved 23% increase in user engagement metrics',
  'Completed comprehensive user feedback analysis',
  'Established clear mobile experience improvement roadmap',
  'Confirmed technical feasibility for retention features',
  'Aligned stakeholder expectations for Q1 2025 priorities'
];

export const remainingTasks: Task[] = [
  { task: 'Finalize mobile UX wireframes', assignee: 'Emma Thompson', priority: 'High', status: 'In Progress' },
  { task: 'Set up development sprint for retention features', assignee: 'David Park', priority: 'High', status: 'Pending' },
  { task: 'Prepare user feedback analysis report', assignee: 'Sarah Chen', priority: 'Medium', status: 'Pending' },
  { task: 'Schedule follow-up meeting with stakeholders', assignee: 'Alex Johnson', priority: 'Low', status: 'Pending' }
];

export const meetingSnippets: Snippet[] = [
  { timestamp: '2:32', speaker: 'Sarah Chen', content: 'Our user engagement is up 23% this quarter, and we\'ve seen significant improvement in retention rates...' },
  { timestamp: '2:38', speaker: 'Emma Thompson', content: 'We should prioritize the mobile experience improvements based on the user feedback data.' },
  { timestamp: '2:42', speaker: 'David Park', content: 'From a technical perspective, we can implement those changes in the next sprint cycle...' }
];
