'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { FeedbackPayload } from '../types/index';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';
import { ApiError } from '@/lib/api/errors';

export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FeedbackPayload) => feedbackService.createFeedback(payload),
    onSuccess: () => {
      toast.success('Feedback submitted successfully');
      // Invalidate student-sessions to refresh if needed
      queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
    },
    onError: (error) => {
      if (ApiError.isApiError(error) && error.code === 'Feedback.AlreadyExists') {
        toast.error('You have already reviewed this session');
        return;
      }
      toast.error('Failed to submit feedback', {
        description: getErrorMessage(error),
      });
    },
  });
}
