import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { transcribeAudio, transcribeAudioWithTimestamps } from '@/lib/services/audio/transcription';
import { TranscriptionResult } from '@/lib/services/audio/transcription';
import { saveFileLocally, validateFileType, validateFileSize } from '@/lib/services/storage/fileStorage';

interface ProcessAudioRequest {
  audio: File;
  transcribe?: boolean;
  includeTimestamps?: boolean;
  language?: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const shouldTranscribe = formData.get('transcribe') === 'true';
    const includeTimestamps = formData.get('includeTimestamps') === 'true';
    const language = (formData.get('language') as string) || 'en';

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file type and size
    const allowedTypes = [
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'audio/flac'
    ];
    
    if (!validateFileType(file.type, allowedTypes)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a valid audio file.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    if (!validateFileSize(file.size, 50 * 1024 * 1024)) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    let filePath: string | undefined;

    try {
      // Save file using secure storage service
      const fileRecord = await saveFileLocally(buffer, file.type, file.name);
      filePath = fileRecord.fullPath;

      let transcription: TranscriptionResult | null = null;
      
      // Transcribe audio if requested
      if (shouldTranscribe) {
        try {
          if (includeTimestamps) {
            transcription = await transcribeAudioWithTimestamps(buffer, file.type, language);
          } else {
            transcription = await transcribeAudio(buffer, file.type, language);
          }
        } catch (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
          // Don't fail the request if transcription fails, just log it
        }
      }

      // Prepare response
      const response = {
        success: true,
        file: {
          filename: fileRecord.filename,
          originalName: fileRecord.originalName,
          size: fileRecord.size,
          mimeType: fileRecord.mimeType,
          path: fileRecord.path,
          url: fileRecord.url,
        },
        transcription: transcription || undefined,
      };

      return NextResponse.json(response);
    } catch (error) {
      // Clean up the file if something went wrong
      try {
        if (typeof filePath !== 'undefined') {
          await unlink(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      {
        error: 'Failed to process audio file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
