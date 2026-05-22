'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';

export function useCompleteSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      sessionService.completeSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-detail', sessionId] });
      toast.success('Session marked as completed successfully');
    },
    onError: (error) => {
      toast.error('Failed to complete session', {
        description: getErrorMessage(error),
      });
    },
  });
}
