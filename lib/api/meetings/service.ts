import axios from 'axios';

export type MeetingStatus = 'draft' | 'scheduled' | 'live' | 'processing' | 'completed' | 'archived';

export interface Meeting {
  id: string;
  title: string;
  sourceLink?: string;
  status: MeetingStatus;
  transcription?: string;
  summary?: any;
  language?: string;
  duration?: number;
  word_count?: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/api';

// Create axios instance with base URL and credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to handle API errors
const handleError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.error || 'Something went wrong');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request
    console.error('Request error:', error.message);
    throw error;
  }
};

export const meetingsApi = {
  // Create a new meeting
  async createMeeting(title: string, sourceLink?: string): Promise<Meeting> {
    try {
      const response = await api.post<Meeting>('/meetings', { title, sourceLink });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // List all meetings
  async listMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get<Meeting[]>('/meetings');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Get a single meeting by ID
  async getMeeting(id: string): Promise<Meeting> {
    try {
      const response = await api.get<Meeting>(`/meetings/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Update a meeting
  async updateMeeting(
    id: string, 
    updates: Partial<{
      title: string;
      sourceLink: string;
      status: MeetingStatus;
    }>
  ): Promise<Meeting> {
    try {
      const response = await api.patch<Meeting>(`/meetings/${id}`, updates);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Delete a meeting
  async deleteMeeting(id: string): Promise<{ success: boolean }> {
    try {
      await api.delete(`/meetings/${id}`);
      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  },

  // Upload a file
  async uploadFile(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post<{ url: string }>(
        `${API_BASE_URL}/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Process a meeting (start AI processing)
  async processMeeting(id: string): Promise<Meeting> {
    try {
      const response = await api.patch<Meeting>(`/meetings/${id}`, { 
        status: 'processing' 
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
