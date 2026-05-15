'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';

export function useTutorFeedbacksQuery(tutorId?: string, limit = 4, offset = 0) {
  return useQuery({
    queryKey: ['tutor-feedbacks', tutorId, limit, offset],
    queryFn: () => feedbackService.getVisibleTutorFeedbacks(tutorId || '', limit, offset),
    enabled: !!tutorId,
  });
}
