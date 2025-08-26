import { useState, useEffect, useCallback } from 'react';
import { meetingsApi, Meeting, MeetingStatus } from '@/lib/api/meetings/service';
import { toast } from 'sonner';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);

  // Load all meetings
  const loadMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meetingsApi.listMeetings();
      setMeetings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load meetings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a single meeting
  const loadMeeting = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const meeting = await meetingsApi.getMeeting(id);
      setCurrentMeeting(meeting);
      return meeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load meeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new meeting
  const createMeeting = useCallback(async (title: string, file?: File) => {
    setLoading(true);
    setError(null);
    try {
      let sourceLink: string | undefined;
      
      // If a file is provided, upload it first
      if (file) {
        const uploadResult = await meetingsApi.uploadFile(file);
        sourceLink = uploadResult.url;
      }
      
      const newMeeting = await meetingsApi.createMeeting(title, sourceLink);
      setMeetings(prev => [newMeeting, ...prev]);
      toast.success('Meeting created successfully');
      return newMeeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create meeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a meeting
  const updateMeeting = useCallback(async (id: string, updates: {
    title?: string;
    sourceLink?: string;
    status?: MeetingStatus;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMeeting = await meetingsApi.updateMeeting(id, updates);
      
      // Update in meetings list
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id ? updatedMeeting : meeting
        )
      );
      
      // Update current meeting if it's the one being updated
      if (currentMeeting?.id === id) {
        setCurrentMeeting(updatedMeeting);
      }
      
      toast.success('Meeting updated successfully');
      return updatedMeeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update meeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMeeting?.id]);

  // Process a meeting (start AI processing)
  const processMeeting = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMeeting = await meetingsApi.processMeeting(id);
      
      // Update in meetings list
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id ? updatedMeeting : meeting
        )
      );
      
      // Update current meeting if it's the one being processed
      if (currentMeeting?.id === id) {
        setCurrentMeeting(updatedMeeting);
      }
      
      toast.success('Meeting processing started');
      return updatedMeeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process meeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMeeting?.id]);

  // Delete a meeting
  const deleteMeeting = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await meetingsApi.deleteMeeting(id);
      
      // Remove from meetings list
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      
      // Clear current meeting if it's the one being deleted
      if (currentMeeting?.id === id) {
        setCurrentMeeting(null);
      }
      
      toast.success('Meeting deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete meeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMeeting?.id]);

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  return {
    meetings,
    currentMeeting,
    loading,
    error,
    loadMeetings,
    loadMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    processMeeting,
  };
}
