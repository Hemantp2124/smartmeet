export interface Tab {
    id: 'summary' | 'snippets' | 'transcript';
    label: string;
    icon: React.ElementType;
  }
  
  export interface ReportData {
    title: string;
    generatedAt: string;
    meetingDate: string;
    duration: string;
    participants: number;
  }
  
  export interface Task {
    task: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress';
  }
  
  export interface Snippet {
    timestamp: string;
    speaker: string;
    content: string;
  }
  