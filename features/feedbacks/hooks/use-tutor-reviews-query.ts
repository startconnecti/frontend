'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';

export function useTutorReviewsQuery() {
  return useQuery({
    queryKey: ['tutor-reviews'],
    queryFn: async () => {
      const [reviews, summary] = await Promise.all([
        feedbackService.getTutorReviews(),
        feedbackService.getTutorReviewSummary(),
      ]);
      return { reviews, summary };
    },
  });
}
