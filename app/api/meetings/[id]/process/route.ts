import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../../../../../lib/db';
import { StorageClient } from '@supabase/storage-js';
import { authOptions } from '@/lib/auth/options';

// Initialize Supabase Storage
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1` : '';
const storageKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const storageClient = new StorageClient(storageUrl, {
  apikey: storageKey,
  Authorization: `Bearer ${storageKey}`,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token?.sub) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const meetingId = params.id;
    
    // Verify meeting exists and user has permission
    const meeting = await prisma.meeting.findUnique({
      where: { 
        id: meetingId,
        hostId: token.sub
      },
      include: {
        audioRecording: true
      }
    });

    if (!meeting) {
      return new NextResponse('Meeting not found or access denied', { status: 404 });
    }

    if (!meeting.audioRecording) {
      return new NextResponse('No audio recording found for this meeting', { status: 400 });
    }

    // Update meeting status to processing
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { 
        processingStatus: 'PROCESSING',
      },
    });

    try {
      // 1. Transcribe the audio
      const transcriptionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/AI/audio/transcribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recordings/${meeting.audioRecording.storagePath}`,
            meetingId,
          }),
        }
      );

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { transcript, language } = await transcriptionResponse.json();

      // Save the transcript
      const transcriptRecord = await prisma.transcript.create({
        data: {
          audioRecordingId: meeting.audioRecording.id,
          text: transcript,
          language,
          status: 'COMPLETED',
        },
      });

      // 2. Generate summary in parallel with action items
      const [summaryResponse, actionItemsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/AI/audio/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript,
            meetingId,
          }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/AI/action-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript,
            meetingId,
            participants: meeting.participants.map((p: { userId: string }) => p.userId),
          }),
        }),
      ]);

      if (!summaryResponse.ok || !actionItemsResponse.ok) {
        throw new Error('Failed to generate summary or action items');
      }

      const { summary, keyPoints } = await summaryResponse.json();
      const { actionItems } = await actionItemsResponse.json();

      // Save summary
      await prisma.meetingSummary.create({
        data: {
          transcriptId: transcriptRecord.id,
          summary,
          keyPoints: keyPoints || [],
        },
      });

      // Save action items
      if (actionItems && actionItems.length > 0) {
        await Promise.all(
          actionItems.map((item: any) =>
            prisma.actionItem.create({
              data: {
                transcriptId: transcriptRecord.id,
                description: item.description,
                assigneeId: item.assigneeId,
                dueDate: item.dueDate ? new Date(item.dueDate) : null,
                status: 'TODO',
                priority: item.priority || 'MEDIUM',
              },
            })
          )
        );
      }

      // Update meeting status to completed
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { 
          processingStatus: 'COMPLETED',
        },
      });

      return NextResponse.json({ 
        success: true,
        meetingId,
        transcriptId: transcriptRecord.id,
      });

    } catch (error) {
      console.error('Error processing meeting:', error);
      
      // Update meeting status to failed
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { 
          processingStatus: 'FAILED',
        },
      });

      return new NextResponse('Error processing meeting', { status: 500 });
    }

  } catch (error) {
    console.error('Error in process meeting endpoint:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
