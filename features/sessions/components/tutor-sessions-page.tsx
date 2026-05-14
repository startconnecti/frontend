'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { SessionCard as ClientSessionCard } from '@/components/client/session-card';
import { ROUTES } from '@/constants/routes';
import { useTutorSessionsQuery } from '../hooks/use-tutor-sessions-query';
import { SessionFilters, SessionStatus } from '../types';
import { SessionFilterTabs } from './session-filter-tabs';

export function TutorSessionsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SessionFilters>({ status: 'all' });
  const { data: sessions = [], isLoading, isError, error, refetch } = useTutorSessionsQuery(filters);

  const handleStatusChange = (status: SessionStatus | 'all') => {
    setFilters({ status });
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
        activeStatus={filters.status} 
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
            <div key={session.id} className="cursor-pointer" onClick={() => router.push(ROUTES.TUTOR.SESSION_DETAIL(session.id))}>
              <ClientSessionCard
                id={session.id}
                participantName={session.student?.fullName || 'Student'}
                subject={session.subject}
                avatar={session.student?.avatarUrl}
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
      </ListState>
    </PageContainer>
  );
}
