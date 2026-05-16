'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { SessionFilterTabs, SessionStatusFilter } from './session-filter-tabs';
import { SessionCard } from './session-card';
import { useStudentSessionsQuery } from '../hooks/use-student-sessions-query';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/api/query-utils';
import { toast } from 'sonner';
import { SessionStatus, Session } from '../types/index';
import { CancelSessionModal } from './cancel-session-modal';
import { LeaveFeedbackModal } from '@/features/feedbacks/components/leave-feedback-modal';
import { Button } from '@/components/ui/button';

export function SessionListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const status = (searchParams.get('status') as SessionStatusFilter) || 'all';
  const page = searchParams.get('page') || '1';
  
  const limit = 20;
  const offset = (Number(page) - 1) * limit;

  const apiStatus = status === 'all' ? undefined : (status as SessionStatus);

  const { data, isLoading, isError, error, refetch } = useStudentSessionsQuery({
    status: apiStatus,
    limit,
    offset,
  });

  const sessions = data?.items || [];
  const total = data?.pagination?.total || 0;

  const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
  const [sessionForFeedback, setSessionForFeedback] = useState<Session | null>(null);

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load sessions', {
        description: getErrorMessage(error),
      });
    }
  }, [isError, error]);

  const handleStatusChange = (newStatus: SessionStatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader 
        title="My Learning Sessions"
        description="View and manage your upcoming and past classes."
      />
      
      <SessionFilterTabs 
        activeStatus={status} 
        onStatusChange={handleStatusChange} 
      />

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={sessions.length === 0}
        emptyTitle="No sessions found"
        emptyDescription="You don't have any sessions matching the selected filter."
        onRetry={() => refetch()}
      >
        <div className="grid grid-cols-1 gap-4">
          {sessions.map((session) => (
            <SessionCard 
              key={session.sessionId} 
              id={session.sessionId}
              hasFeedback={session.hasFeedback}
              tutorName={session.tutorName}
              subjectName={session.subjectName}
              date={new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              time={`${new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date(session.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
              status={session.status}
              meetingUrl={session.meetingUrl}
              onCancel={() => setSessionToCancel(session)}
              onFeedback={() => setSessionForFeedback(session)}
            />
          ))}
        </div>
        
        {total > limit && (
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              disabled={Number(page) <= 1}
              onClick={() => handlePageChange(Number(page) - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <Button 
              variant="outline" 
              disabled={Number(page) >= Math.ceil(total / limit)}
              onClick={() => handlePageChange(Number(page) + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </ListState>

      {sessionToCancel && (
        <CancelSessionModal
          isOpen={!!sessionToCancel}
          onClose={() => setSessionToCancel(null)}
          sessionId={sessionToCancel.sessionId}
        />
      )}

      {sessionForFeedback && (
        <LeaveFeedbackModal
          isOpen={!!sessionForFeedback}
          onClose={() => setSessionForFeedback(null)}
          sessionId={sessionForFeedback.sessionId}
        />
      )}
    </PageContainer>
  );
}
