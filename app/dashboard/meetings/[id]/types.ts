export interface ActionItem {
  id: number;
  text: string;
  assignedTo: string;
  dueDate: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  participants: number;
  agenda: string;
  recordingUrl?: string;
  transcript?: string;
  actionItems?: ActionItem[];
}
