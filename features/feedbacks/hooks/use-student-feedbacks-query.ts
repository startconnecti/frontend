'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';

export function useStudentFeedbacksQuery(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['student-feedbacks', params.page, params.limit],
    queryFn: () => feedbackService.getStudentFeedbacks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
