export interface MeetingData {
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface TranscriptEntry {
  speaker: string;
  time: string;
  text: string;
}

export interface ActionItem {
  task: string;
  assignee: string;
  due: string;
}
