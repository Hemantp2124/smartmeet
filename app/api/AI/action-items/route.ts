import { NextResponse } from 'next/server';
import { extractActionItems } from '@/lib/services/ai/actionItems';

export async function POST(request: Request) {
  try {
    const { transcript, options } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const actionItems = await extractActionItems(transcript, options);
    
    return NextResponse.json({ actionItems });
  } catch (error) {
    console.error('Error in action items API:', error);
    return NextResponse.json(
      { error: 'Failed to extract action items' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering is forced
