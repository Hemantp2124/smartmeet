// app/api/meetings/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: params.id,
        OR: [
          { hostId: session.user.email },
          { participants: { some: { email: session.user.email } } },
        ],
      },
      include: {
        host: {
          select: { name: true, email: true, image: true },
        },
        participants: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    if (!meeting) {
      return new NextResponse('Meeting not found', { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Meeting fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, description, startTime, endTime, participantEmails = [] } = body;

    // Verify user is the host of the meeting
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id: params.id },
    });

    if (!existingMeeting) {
      return new NextResponse('Meeting not found', { status: 404 });
    }

    if (existingMeeting.hostId !== session.user.email) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        participants: {
          set: [], // Clear existing participants
          connectOrCreate: participantEmails.map((email: string) => ({
            where: { email },
            create: { email, name: email.split('@')[0] },
          })),
        },
      },
      include: {
        host: {
          select: { name: true, email: true, image: true },
        },
        participants: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error('Meeting update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify user is the host of the meeting
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id: params.id },
    });

    if (!existingMeeting) {
      return new NextResponse('Meeting not found', { status: 404 });
    }

    if (existingMeeting.hostId !== session.user.email) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete meeting
    await prisma.meeting.delete({
      where: { id: params.id },
    });

    return new NextResponse('Meeting deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Meeting delete error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}