// app/api/AI/audio/summarize/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcription, apiKey, provider = 'GPT-4' } = await req.json();

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription text is required' },
        { status: 400 }
      );
    }

    // Call Supersmart API for summarization
    const response = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.SUPERSMART_API_KEY}`
      },
      body: JSON.stringify({
        transcript: transcription,
        provider
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate summary');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to process summarization request' },
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