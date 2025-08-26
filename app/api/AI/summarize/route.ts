import { NextResponse } from 'next/server';
import { generateMeetingSummary } from '@/lib/services/ai/summarization';

export async function POST(request: Request) {
  try {
    const { transcript, options } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const summary = await generateMeetingSummary(transcript, options);
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to generate meeting summary' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering is forced
