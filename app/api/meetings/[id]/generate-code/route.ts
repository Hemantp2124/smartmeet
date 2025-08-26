import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../../../../../lib/db';

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
    const { codeSnippet, language = 'typescript', type = 'CODE' } = await request.json();
    
    // Verify meeting exists and user has permission
    const meeting = await prisma.meeting.findUnique({
      where: { 
        id: meetingId,
        hostId: token.sub
      },
      include: {
        audioRecording: {
          include: {
            transcript: true
          }
        }
      }
    });

    if (!meeting) {
      return new NextResponse('Meeting not found or access denied', { status: 404 });
    }

    if (!meeting.audioRecording?.transcript) {
      return new NextResponse('No transcript found for this meeting', { status: 400 });
    }

    // Generate code using AI
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/AI/code/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: meeting.audioRecording.transcript.text,
        codeSnippet,
        language,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate code');
    }

    const { code } = await response.json();

    // Save the generated code
    const codeGeneration = await prisma.codeGeneration.create({
      data: {
        transcriptId: meeting.audioRecording.transcript.id,
        type,
        language,
        code,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ 
      success: true,
      codeGeneration,
    });

  } catch (error) {
    console.error('Error generating code:', error);
    
    // Update code generation status to failed if it was created
    if (params?.id) {
      const meetingId = params.id;
      await prisma.codeGeneration.updateMany({
        where: { 
          transcript: {
            audioRecording: {
              meetingId
            }
          },
          status: 'GENERATING'
        },
        data: { 
          status: 'FAILED',
        },
      });
    }

    return new NextResponse('Error generating code', { status: 500 });
  }
}
