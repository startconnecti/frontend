'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/query-utils';

export function useCancelSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: string; payload: { cancellation_reason?: string } }) =>
      sessionService.cancelSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
      toast.success('Session cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel session', {
        description: getErrorMessage(error),
      });
    },
  });
}
