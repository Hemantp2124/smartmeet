import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '../../../../../lib/db';
import { StorageClient } from '@supabase/storage-js';
import { getToken } from 'next-auth/jwt';

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
    });

    if (!meeting) {
      return new NextResponse('Meeting not found or access denied', { status: 404 });
    }

    // Check if there's already an audio recording for this meeting
    const existingRecording = await prisma.audioRecording.findUnique({
      where: { meetingId }
    });

    if (existingRecording) {
      return new NextResponse('Audio already uploaded for this meeting', { status: 400 });
    }

    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file type and size
    const validMimeTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (!validMimeTypes.includes(file.type)) {
      return new NextResponse('Invalid file type', { status: 400 });
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return new NextResponse('File too large. Max size is 100MB', { status: 400 });
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${meetingId}-${Date.now()}.${fileExt}`;
    const filePath = `meetings/${meetingId}/${fileName}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await storageClient
      .from('recordings')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return new NextResponse('Error uploading file', { status: 500 });
    }

    // Create audio recording record
    const audioRecording = await prisma.audioRecording.create({
      data: {
        meetingId,
        storagePath: filePath,
        status: 'UPLOADED',
        size: file.size,
        mimeType: file.type,
      },
    });

    // Update meeting status
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { 
        status: 'COMPLETED',
        processingStatus: 'PENDING',
      },
    });

    return NextResponse.json({ 
      success: true, 
      audioRecordingId: audioRecording.id,
      filePath: uploadData.path,
    });

  } catch (error) {
    console.error('Error processing audio upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
