'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';
import { Button } from '@/components/ui/button';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { SessionCard as ClientSessionCard } from '@/components/client/session-card';
import { ROUTES } from '@/constants/routes';
import { useTutorSessionsQuery } from '../hooks/use-tutor-sessions-query';
import { SessionStatus } from '../types';
import { SessionFilterTabs } from './session-filter-tabs';

export function TutorSessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = (searchParams.get('status') as any) || 'all';
  const page = searchParams.get('page') || '1';
  
  const limit = 10;
  const offset = (Number(page) - 1) * limit;
  
  const { data, isLoading, isError, error, refetch } = useTutorSessionsQuery({
    status: status === 'all' ? undefined : status,
    limit,
    offset,
  });
  
  const sessions = data?.items || [];
  const total = data?.pagination?.total || 0;

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load sessions', {
        description: getErrorMessage(error),
      });
    }
  }, [isError, error]);

  const handleStatusChange = (newStatus: any) => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Teaching Sessions"
          description="View and manage your upcoming and past student sessions."
        />
      </div>

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
            <div key={session.sessionId} className="cursor-pointer" onClick={() => router.push(ROUTES.TUTOR.SESSION_DETAIL(session.sessionId))}>
              <ClientSessionCard
                id={session.sessionId}
                participantName={session.studentName || 'Student'}
                subject={session.subjectName}
                status={session.status}
                date={new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                startTime={new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                endTime={new Date(session.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                joinUrl={session.meetingUrl}
                onJoin={() => session.meetingUrl && window.open(session.meetingUrl, '_blank')}
                onReschedule={() => {}} // Disabled
              />
            </div>
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
    </PageContainer>
  );
}
