import { NextRequest, NextResponse } from 'next/server';
import { createMeeting, listMeetings, getMeeting, updateMeeting, deleteMeeting } from './meetingsStore';
import { handleApiError, createSuccessResponse, requireAuth, parseJsonBody } from './api-utils';

export async function handleCreateMeeting(req: NextRequest) {
  try {
    const { title, sourceLink } = await parseJsonBody<{ title: string; sourceLink?: string }>(req);
    
    if (!title) {
      throw new Error('Title is required');
    }
    
    const meeting = await createMeeting({
      id: crypto.randomUUID(),
      title,
      sourceLink,
      status: 'draft',
      // createdAt and updatedAt will be added by createMeeting
    });
    
    return createSuccessResponse(meeting, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function handleListMeetings() {
  try {
    const meetings = await listMeetings();
    return createSuccessResponse(meetings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function handleGetMeeting(id: string) {
  try {
    const meeting = await getMeeting(id);
    if (!meeting) {
      return new NextResponse(
        JSON.stringify({ error: 'Meeting not found' }),
        { status: 404 }
      );
    }
    return createSuccessResponse(meeting);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function handleUpdateMeeting(id: string, req: NextRequest) {
  try {
    const updates = await parseJsonBody<{
      title?: string;
      sourceLink?: string;
      status?: 'draft' | 'scheduled' | 'live' | 'processing' | 'completed' | 'archived';
    }>(req);
    
    // Get current meeting to validate status transitions
    const currentMeeting = await getMeeting(id);
    if (!currentMeeting) {
      return new NextResponse(
        JSON.stringify({ error: 'Meeting not found' }),
        { status: 404 }
      );
    }
    
    // Validate status transitions
    if (updates.status && updates.status !== currentMeeting.status) {
      const validTransitions: Record<string, string[]> = {
        draft: ['scheduled', 'live'],
        scheduled: ['processing'],
        live: ['processing'],
        processing: ['completed'],
        completed: ['archived'],
        archived: []
      };
      
      const allowedTransitions = validTransitions[currentMeeting.status] || [];
      if (!allowedTransitions.includes(updates.status)) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Invalid status transition',
            details: `Cannot transition from ${currentMeeting.status} to ${updates.status}`
          }),
          { status: 400 }
        );
      }
    }
    
    const updatedMeeting = await updateMeeting(id, updates);
    
    // If status is being set to processing, trigger AI processing
    if (updates.status === 'processing' && currentMeeting.sourceLink) {
      // In a real app, you would enqueue a background job here
      // For this example, we'll simulate processing
      console.log('Starting AI processing for meeting:', id);
      
      // Simulate AI processing
      setTimeout(async () => {
        try {
          // In a real app, you would call your AI services here
          const transcription = 'This is a simulated transcription.';
          const summary = 'This is a simulated summary.';
          
          await updateMeeting(id, {
            status: 'completed',
            transcription,
            summary,
            language: 'en',
            duration: 600, // 10 minutes
            word_count: transcription.split(' ').length
          });
          
          console.log('AI processing completed for meeting:', id);
        } catch (error) {
          console.error('Error during AI processing:', error);
          // Update meeting with error status
          await updateMeeting(id, {
            status: 'completed',
            transcription: 'Error processing meeting.',
            summary: 'An error occurred while processing this meeting.'
          });
        }
      }, 5000); // Simulate 5 second processing time
    }
    
    return createSuccessResponse(updatedMeeting);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function handleDeleteMeeting(id: string) {
  try {
    const deleted = await deleteMeeting(id);
    if (!deleted) {
      return new NextResponse(
        JSON.stringify({ error: 'Meeting not found' }),
        { status: 404 }
      );
    }
    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
