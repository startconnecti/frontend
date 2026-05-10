'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { CreateFeedbackRequest } from '../types';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFeedbackRequest) => feedbackService.createFeedback(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
      toast.success('Feedback submitted successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to submit feedback');
    },
  });
}
