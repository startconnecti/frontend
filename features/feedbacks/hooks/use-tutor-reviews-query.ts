'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { useTutorProfileQuery } from '@/features/tutor-profile/hooks/use-tutor-profile-query';

export function useTutorReviewsQuery(page = 1, limit = 10) {
  const { data: tutorProfile } = useTutorProfileQuery();
  const tutorId = tutorProfile?.id;

  return useQuery({
    queryKey: ['tutor-feedbacks', tutorId, page, limit],
    enabled: !!tutorId,
    queryFn: async () => {
      const reviews = await feedbackService.getTutorReviews({ tutorId, page, limit });
      return { reviews };
    },
  });
}

export function useTutorReviewStatisticsQuery() {
  const { data: tutorProfile } = useTutorProfileQuery();
  const tutorId = tutorProfile?.id;

  return useQuery({
    queryKey: ['tutor-feedback-statistics', tutorId],
    enabled: !!tutorId,
    queryFn: async () => {
      if (!tutorId) throw new Error('No tutor ID');
      const response = await feedbackService.getTutorReviewStatistics(tutorId);
      return response.statistics;
    },
  });
}
