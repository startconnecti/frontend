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

export function SessionListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const status = (searchParams.get('status') as SessionStatusFilter) || 'scheduled';
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
        
        <div className="bg-muted p-4 rounded-lg text-xs text-muted-foreground flex justify-between items-center">
          <span>Current Page: {page}</span>
          <span>
            Showing {sessions.length} of {total} total sessions
          </span>
        </div>
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
