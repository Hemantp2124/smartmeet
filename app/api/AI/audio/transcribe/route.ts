// app/api/AI/audio/transcribe/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

// Ensure upload directory exists
const uploadDir = join(process.cwd(), 'uploads/audio');

export async function POST(req: Request) {
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error('Failed to create upload directory:', e);
      return NextResponse.json(
        { error: 'Failed to initialize file storage' },
        { status: 500 }
      );
    }
  }

  try {
    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const apiKey = formData.get('api_key') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'File must be an audio file' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily
    const filename = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadDir, filename);
    
    try {
      await writeFile(filepath, buffer);
    } catch (error) {
      console.error('Failed to save file:', error);
      return NextResponse.json(
        { error: 'Failed to process audio file' },
        { status: 500 }
      );
    }

    // Call Supersmart API for transcription
    const form = new FormData();
    form.append('file', new Blob([buffer]), file.name);
    
    const response = await fetch('http://localhost:8000/transcribe-upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || process.env.SUPERSMART_API_KEY}`
      },
      body: form
    });

    // Clean up temp file
    try {
      await unlink(filepath);
    } catch (e) {
      console.error('Failed to delete temp file:', e);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to transcribe audio');
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      transcription: result.transcription,
      language: result.language,
      duration: result.duration,
      word_count: result.word_count
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process transcription',
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

// Add TypeScript configuration for Next.js route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we're using multipart/form-data
  },
};