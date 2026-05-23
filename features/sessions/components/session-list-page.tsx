'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { SessionFilterTabs, SessionStatusFilter } from './session-filter-tabs';
import { SessionCard as ClientSessionCard } from '@/components/client/session-card';
import { ROUTES } from '@/constants/routes';
import { useStudentSessionsQuery } from '../hooks/use-student-sessions-query';
import { useEffect } from 'react';
import { getErrorMessage } from '@/lib/api/query-utils';
import { toast } from 'sonner';
import { SessionStatus } from '../types/index';
import { Pagination } from '@/components/shared/pagination';

export function SessionListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const status = (searchParams.get('status') as SessionStatusFilter) || 'all';
  const page = searchParams.get('page') || '1';
  
  const limit = 10;
  const apiStatus = status === 'all' ? undefined : (status as SessionStatus);

  const { data, isLoading, isError, error, refetch } = useStudentSessionsQuery({
    status: apiStatus,
    limit,
    page: Number(page),
  });

  const sessions = data?.items || [];
  const total = data?.meta?.pagination?.total || 0;

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
            <div key={session.sessionId} className="cursor-pointer" onClick={() => router.push(ROUTES.STUDENT.SESSION_DETAIL(session.sessionId))}>
              <ClientSessionCard
                id={session.sessionId}
                participantName={session.tutorName || 'Unknown Tutor'}
                subject={session.subjectName || 'Standard Session'}
                status={session.status}
                date={new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                startTime={new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                endTime={new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                joinUrl={session.meetingUrl}
              />
            </div>
          ))}
        </div>
        
        <Pagination 
          currentPage={Number(page)} 
          totalPages={Math.ceil(total / limit)} 
          onPageChange={handlePageChange} 
        />
      </ListState>
    </PageContainer>
  );
}
