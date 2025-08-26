'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Loader2, ArrowLeft, Play, Pencil, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useMeetings } from '@/app/hooks/useMeetings';
import { format } from 'date-fns';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentMeeting, loadMeeting, updateMeeting, processMeeting, deleteMeeting, loading } = useMeetings();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Load meeting data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      loadMeeting(id);
    }
  }, [id, loadMeeting]);

  const handleProcessMeeting = async () => {
    if (!currentMeeting) return;
    
    try {
      setIsProcessing(true);
      await processMeeting(currentMeeting.id);
      // The meeting will be updated via the useMeetings hook
    } catch (error) {
      console.error('Error processing meeting:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!currentMeeting) return;
    
    if (window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      try {
        await deleteMeeting(currentMeeting.id);
        router.push('/dashboard/meetings');
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  if (loading && !currentMeeting) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentMeeting) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Meeting not found</h2>
        <p className="text-muted-foreground mt-2">The requested meeting could not be found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/dashboard/meetings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Meetings
        </Button>
      </div>
    );
  }

  type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary';

  const getStatusBadge = () => {
    const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
      draft: { variant: 'outline', label: 'Draft' },
      scheduled: { variant: 'secondary', label: 'Scheduled' },
      live: { variant: 'destructive', label: 'Live' },
      processing: { variant: 'secondary', label: 'Processing...' },
      completed: { variant: 'default', label: 'Completed' },
      archived: { variant: 'outline', label: 'Archived' },
    };
    
    const status = statusMap[currentMeeting.status] || { variant: 'outline' as const, label: currentMeeting.status };
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard/meetings')}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Meetings
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/dashboard/meetings/${currentMeeting.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteMeeting}
            disabled={isProcessing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentMeeting.title || 'Untitled Meeting'}
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="text-sm text-muted-foreground">
              Created on {format(new Date(currentMeeting.createdAt), 'MMM d, yyyy')}
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {currentMeeting.status === 'completed' && (
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Play Recording
          </Button>
        )}
        
        {currentMeeting.status === 'scheduled' && (
          <Button onClick={handleProcessMeeting} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Processing
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="transcript" className="w-full">
        <TabsList>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {currentMeeting.transcription ? (
                <div className="whitespace-pre-wrap">{currentMeeting.transcription}</div>
              ) : (
                <div className="text-muted-foreground text-center py-12">
                  {currentMeeting.status === 'processing' ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Processing transcript...</p>
                    </div>
                  ) : (
                    'No transcript available'
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {currentMeeting.summary ? (
                <div>{JSON.stringify(currentMeeting.summary, null, 2)}</div>
              ) : (
                <div className="text-muted-foreground text-center py-12">
                  {currentMeeting.status === 'processing' ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Generating summary...</p>
                    </div>
                  ) : (
                    'No summary available. Process the meeting to generate a summary.'
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p>{currentMeeting.title || 'Untitled Meeting'}</p>
              </div>
              
              {currentMeeting.sourceLink && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
                  <a 
                    href={currentMeeting.sourceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {currentMeeting.sourceLink}
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex items-center">
                  {getStatusBadge()}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{format(new Date(currentMeeting.createdAt), 'PPpp')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{format(new Date(currentMeeting.updatedAt), 'PPpp')}</p>
              </div>
              
              {currentMeeting.duration && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p>{Math.round(currentMeeting.duration / 60)} minutes</p>
                </div>
              )}
              
              {currentMeeting.language && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                  <p>{currentMeeting.language}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
