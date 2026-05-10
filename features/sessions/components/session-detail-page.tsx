'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useSessionDetailQuery } from '../hooks/use-session-detail-query';
import { SessionDetailCard } from './session-detail-card';

export function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, isLoading, isError } = useSessionDetailQuery(id);

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </PageContainer>
    );
  }

  if (isError || !session) {
    return (
      <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Search className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Session not found</h3>
          <p className="text-muted-foreground">The session you are looking for does not exist or has been removed.</p>
        </div>
        <Button onClick={() => router.push(ROUTES.STUDENT.SESSIONS)}>Back to Sessions</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.STUDENT.SESSIONS)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <SectionHeader 
          title="Session Details"
          description="View complete information about this learning session."
        />
      </div>

      <SessionDetailCard session={session} />
    </PageContainer>
  );
}
