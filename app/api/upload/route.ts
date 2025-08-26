import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'bin';
    const filename = `${uuidv4()}.${fileExt}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    const filePath = join(uploadDir, filename);
    const publicPath = `/uploads/${filename}`;

    try {
      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });

      // Save file to disk
      await writeFile(filePath, buffer);

      // Prepare response
      const response = {
        success: true,
        file: {
          filename,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          path: publicPath,
          url: `${process.env.NEXT_PUBLIC_APP_URL || ''}${publicPath}`,
        },
      };

      return NextResponse.json(response);
    } catch (error) {
      // Clean up the file if something went wrong
      try {
        await unlink(filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to process upload',
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