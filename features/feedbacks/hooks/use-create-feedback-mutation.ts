'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { CreateFeedbackRequest } from '../types';
import { toast } from 'sonner';

export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFeedbackRequest) => feedbackService.createFeedback(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
      toast.success('Feedback submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit feedback');
    },
  });
}
