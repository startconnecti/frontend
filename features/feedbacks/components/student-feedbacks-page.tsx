'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { useStudentFeedbacksQuery } from '../hooks/use-student-feedbacks-query';
import { ReviewList } from './review-list';
import { Pagination } from '@/components/shared/pagination';

export function StudentFeedbacksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page') || '1';
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useStudentFeedbacksQuery({
    page: Number(page),
    limit,
  });

  const feedbacks = data?.items || [];
  const total = data?.meta?.pagination?.total || 0;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader 
        title="My Feedbacks"
        description="Review the feedback you've provided for your tutors."
      />

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={feedbacks.length === 0}
        emptyTitle="No feedbacks yet"
        emptyDescription="You haven't submitted any feedbacks for your sessions yet."
        onRetry={() => refetch()}
      >
        <ReviewList reviews={feedbacks} showParticipant={false} />
        
        <Pagination 
          currentPage={Number(page)} 
          totalPages={Math.ceil(total / limit)} 
          onPageChange={handlePageChange} 
        />
      </ListState>
    </PageContainer>
  );
}
