'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Video, ArrowLeft, Share2, Download, Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Meeting } from './types';
import AudioUploader from '@/app/components/dashboard/meetings/AudioUploader';

export default function MeetingDetailClient({ initialMeeting }: { initialMeeting: Meeting }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting>(initialMeeting);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch meeting data
  const fetchMeeting = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/meetings/${meeting.id}`);
      if (!response.ok) throw new Error('Failed to fetch meeting');
      const data = await response.json();
      setMeeting(data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      toast.error('Failed to load meeting details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/meetings/${meeting.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }

      toast.success('Meeting deleted successfully');
      router.push('/dashboard/meetings');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete meeting');
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Meeting link copied to clipboard');
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingId', meeting.id);

    try {
      setIsUploading(true);
      const response = await fetch('/api/audio/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process audio');
      }

      const result = await response.json();
      toast.success('Audio processed successfully');
      
      // Refresh meeting data to show the new audio
      await fetchMeeting();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process audio');
    } finally {
      setIsUploading(false);
    }
  };



  if (isLoading && !initialMeeting) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!initialMeeting) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Meeting not found</h2>
        <p className="text-gray-500 mb-4">The requested meeting could not be found.</p>
        <button
          onClick={() => router.push('/dashboard/meetings')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Meetings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white mb-2"
            disabled={isLoading}
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Meetings
          </button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{meeting.title || 'Untitled Meeting'}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                meeting.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400' 
                  : meeting.status === 'in-progress'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {meeting.status ? meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1) : 'Draft'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
              {meeting.date && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(meeting.date)}
                </div>
              )}
              {meeting.duration && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {meeting.duration}
                </div>
              )}
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                {Array.isArray(meeting.participants) 
                  ? `${meeting.participants.length} participant${meeting.participants.length !== 1 ? 's' : ''}`
                  : '0 participants'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              disabled={isLoading || isUploading}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={16} />
              Share
            </button>
            <button 
              onClick={() => router.push(`/dashboard/meetings/${meeting.id}/edit`)}
              disabled={isLoading || isUploading}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit size={16} />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isLoading || isUploading}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'transcript', label: 'Transcript', disabled: !meeting.transcript },
              { id: 'recording', label: 'Recording', disabled: !meeting.recordingUrl },
              { 
                id: 'action-items', 
                label: 'Action Items', 
                disabled: !meeting.actionItems || (Array.isArray(meeting.actionItems) && meeting.actionItems.length === 0) 
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : tab.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-200 hover:border-gray-300 border-transparent'
                }`}
                title={tab.disabled ? 'No data available' : ''}
              >
                {tab.label}
                {tab.disabled && (
                  <span className="ml-1.5 text-xs text-gray-500">•</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upload area for recordings */}
        {activeTab === 'recording' && !meeting.recordingUrl && (
          <div className="mt-8 p-6 border border-dashed border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Upload Meeting Recording</h3>
            <AudioUploader 
              onUpload={handleFileUpload} 
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium mb-4">Agenda</h3>
                <p className="text-gray-300">{meeting.agenda}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-4">Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Date & Time</p>
                      <p>{formatDate(meeting.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p>{meeting.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Participants</p>
                      <p>{meeting.participants} people</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Action Items</h3>
                    <button className="text-sm text-purple-400 hover:text-purple-300">
                      View All
                    </button>
                  </div>
                  {(meeting.actionItems || []).length > 0 ? (
                    <div className="space-y-3">
                      {(meeting.actionItems || []).slice(0, 3).map((item) => (
                        <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                          <p className="font-medium">{item.text}</p>
                          <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>Assigned to {item.assignedTo}</span>
                            <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No action items yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'transcript' && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Meeting Transcript</h3>
                <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm px-3 py-1.5 rounded-lg transition">
                  <Download size={14} />
                  Download
                </button>
              </div>
              <div className="bg-black/30 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {meeting.transcript || 'No transcript available for this meeting.'}
              </div>
            </div>
          )}
          
          {activeTab === 'recording' && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Meeting Recording</h3>
                <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm px-3 py-1.5 rounded-lg transition">
                  <Download size={14} />
                  Download
                </button>
              </div>
              
              {meeting.recordingUrl ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Video size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">Recording will be available here</p>
                      <p className="text-sm text-gray-500 mt-2">In a real app, this would show the video player</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video size={48} className="mx-auto mb-4 text-gray-500" />
                  <h4 className="text-lg font-medium mb-1">No Recording Available</h4>
                  <p className="text-gray-400">This meeting doesn't have a recording.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'action-items' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Action Items</h3>
                <button className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition">
                  <Plus size={16} />
                  Add Action Item
                </button>
              </div>
              
              {meeting.actionItems && meeting.actionItems.length > 0 ? (
                <div className="space-y-3">
                  {meeting.actionItems.map((item) => (
                    <div key={item.id} className="glass-card p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.text}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                            <span>Assigned to: {item.assignedTo}</span>
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              new Date(item.dueDate) < new Date()
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {new Date(item.dueDate) < new Date() ? 'Overdue' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <p className="text-gray-400">No action items have been added to this meeting.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
