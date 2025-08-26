import { prisma } from '@/lib/db';

interface AnalyticsData {
  meetings: {
    total: number;
    recent: number;
    withRecordings: number;
  };
  users: {
    total: number;
    active: number;
  };
  actionItems: {
    total: number;
    completed: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  usage: {
    transcriptions: number;
    codeGenerations: number;
  };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all counts in parallel
    const [
      totalUsers,
      totalMeetings,
      recentMeetings,
      meetingsWithRecordings,
      totalActionItems,
      completedActionItems,
      actionItemsByStatus,
      actionItemsByPriority,
      totalTranscriptions,
      totalCodeGenerations
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      
      // Meeting stats
      prisma.meeting.count(),
      prisma.meeting.count({
        where: {
          createdAt: { gte: thirtyDaysAgo }
        }
      }),
      prisma.meeting.count({
        where: {
          audioRecordings: {
            some: {}
          }
        }
      }),
      
      // Action item stats
      prisma.actionItem.count(),
      prisma.actionItem.count({ 
        where: { 
          status: 'DONE' 
        } 
      }),
      
      // Group action items by status and priority
      prisma.actionItem.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.actionItem.groupBy({
        by: ['priority'],
        _count: true,
        where: {
          priority: { not: null }
        }
      }),
      
      // Usage stats
      prisma.audioRecording.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      prisma.codeGeneration.count({
        where: {
          status: 'COMPLETED'
        }
      })
    ]);

    // Calculate active users (users who created meetings in the last 30 days)
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          { hostedMeetings: { some: { createdAt: { gte: thirtyDaysAgo } } } },
          { participants: { some: { joinedAt: { gte: thirtyDaysAgo } } } }
        ]
      }
    });

    // Format action items by status
    const actionItemsByStatusMap = actionItemsByStatus.reduce<Record<string, number>>(
      (acc, { status, _count }) => ({
        ...acc,
        [status]: _count
      }), 
      {}
    );

    // Format action items by priority
    const actionItemsByPriorityMap = actionItemsByPriority.reduce<Record<string, number>>(
      (acc, { priority, _count }) => ({
        ...acc,
        [priority || 'UNKNOWN']: _count
      }), 
      {}
    );

    return {
      meetings: {
        total: totalMeetings,
        recent: recentMeetings,
        withRecordings: meetingsWithRecordings,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      actionItems: {
        total: totalActionItems,
        completed: completedActionItems,
        byStatus: actionItemsByStatusMap,
        byPriority: actionItemsByPriorityMap,
      },
      usage: {
        transcriptions: totalTranscriptions,
        codeGenerations: totalCodeGenerations,
      },
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    throw new Error('Failed to generate analytics data');
  }
}

// Track an analytics event
export async function trackEvent(
  eventType: string, 
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventType}:`, metadata);
    }
    
    // In production, you can implement actual event tracking here
    // For example, sending events to an analytics service
    // or storing them in your database
    
    // Example implementation with Prisma (uncomment and modify as needed):
    /*
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        metadata: JSON.stringify(metadata),
        timestamp: new Date(),
      },
    });
    */
  } catch (error) {
    console.error('Error tracking event:', error);
    // Don't throw to prevent breaking the main application flow
  }
}
