import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { meetingLinkService } from '@/lib/services/meeting/meetingLinkService';
import { meetingService } from '@/lib/services/meeting/meetingService';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    // Parse the request body
    const { link, title } = await request.json();
    
    if (!link) {
      return NextResponse.json(
        { error: 'Meeting link is required' }, 
        { status: 400 }
      );
    }

    // Parse the meeting link
    const meetingInfo = meetingLinkService.parseMeetingLink(link);
    
    if (!meetingInfo) {
      return NextResponse.json(
        { 
          error: 'Unsupported meeting link. Please provide a valid Zoom, Google Meet, Microsoft Teams, or Webex link.' 
        }, 
        { status: 400 }
      );
    }

    // Generate a title if not provided
    const meetingTitle = title || meetingLinkService.generateMeetingTitle(meetingInfo.platform);
    
    // Create a new meeting record
    const meeting = await meetingService.createMeeting({
      title: meetingTitle,
      link,
      hostId: session.user.id,
    });

    // In a real app, you would start a background job to join the meeting and record it
    // For now, we'll just return the meeting info
    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        title: meeting.title,
        link: meeting.link,
        platform: meetingInfo.platform,
        isJoinable: meetingInfo.isJoinable,
        requiresAuth: meetingInfo.requiresAuth,
        joinUrl: meetingInfo.joinUrl,
        status: 'pending',
      },
    });

  } catch (error) {
    console.error('Error processing meeting link:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the meeting link' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
