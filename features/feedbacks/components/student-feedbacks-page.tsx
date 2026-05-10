'use client';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { useStudentFeedbacksQuery } from '../hooks/use-student-feedbacks-query';
import { ReviewList } from './review-list';

export function StudentFeedbacksPage() {
  const { data: feedbacks = [], isLoading, isError, refetch } = useStudentFeedbacksQuery();

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader 
        title="My Feedbacks"
        description="Review the feedback you've provided for your tutors."
      />

      <ListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={feedbacks.length === 0}
        emptyTitle="No feedbacks yet"
        emptyDescription="You haven't submitted any feedbacks for your sessions yet."
        onRetry={() => refetch()}
      >
        <ReviewList reviews={feedbacks} showParticipant={false} />
      </ListState>
    </PageContainer>
  );
}
