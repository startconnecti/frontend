'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback-service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';

export function useDeleteFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => feedbackService.deleteFeedback(id),
    onSuccess: () => {
      toast.success('Feedback deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['student-feedbacks'] });
    },
    onError: (error) => {
      toast.error('Failed to delete feedback', {
        description: getErrorMessage(error),
      });
    },
  });
}
