'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { FeedbackPayload } from '../types/index';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';

export function useEditFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FeedbackPayload> }) => 
      feedbackService.updateFeedback(id, payload),
    onSuccess: () => {
      toast.success('Feedback updated successfully');
      queryClient.invalidateQueries({ queryKey: ['student-feedbacks'] });
    },
    onError: (error) => {
      toast.error('Failed to update feedback', {
        description: getErrorMessage(error),
      });
    },
  });
}
