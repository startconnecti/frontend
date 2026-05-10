'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar } from 'lucide-react';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { SessionCard } from '@/components/client/tutor-card'; // Wait, I just checked components/client/tutor-card.tsx earlier, but I saw session-card.tsx there too.
import { SessionCard as ClientSessionCard } from '@/components/client/session-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useStudentSessionsQuery } from '../hooks/use-student-sessions-query';
import { SessionFilters, SessionStatus } from '../types';
import { SessionFilterTabs } from './session-filter-tabs';

export function StudentSessionsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SessionFilters>({ status: 'all' });
  const { data: sessions = [], isLoading, isError, refetch } = useStudentSessionsQuery(filters);

  const handleStatusChange = (status: SessionStatus | 'all') => {
    setFilters({ status });
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="My Learning Sessions"
          description="View and manage your upcoming and past classes."
        />
        <Button className="font-bold gap-2" asChild>
          <Link href={ROUTES.DISCOVER}>
            <Search className="h-4 w-4" />
            Find More Tutors
          </Link>
        </Button>
      </div>

      <SessionFilterTabs 
        activeStatus={filters.status} 
        onStatusChange={handleStatusChange} 
      />

      <ListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={sessions.length === 0}
        emptyTitle="No sessions found"
        emptyDescription="You don't have any sessions matching the selected filter."
        onRetry={() => refetch()}
      >
        <div className="grid grid-cols-1 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="cursor-pointer" onClick={() => router.push(`${ROUTES.STUDENT.SESSIONS}/${session.id}`)}>
              <ClientSessionCard
                id={session.id}
                participantName={session.tutor.fullName}
                subject={session.subject}
                avatar={session.tutor.avatarUrl}
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
