'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';

export function useStudentFeedbacksQuery(params: { page?: number; limit?: number; studentId?: string }) {
  return useQuery({
    queryKey: ['student-feedbacks', params.studentId, params.page, params.limit],
    queryFn: () => feedbackService.getStudentFeedbacks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.studentId,
  });
}
