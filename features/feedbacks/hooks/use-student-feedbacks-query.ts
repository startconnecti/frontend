'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';

export function useStudentFeedbacksQuery() {
  return useQuery({
    queryKey: ['student-feedbacks'],
    queryFn: () => feedbackService.getStudentFeedbacks(),
  });
}
