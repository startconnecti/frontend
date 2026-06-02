import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentDisputesService } from '../services/student-disputes.service';

interface CancelDisputeVars {
  disputeId: string;
  sessionId: string;
}

export function useCancelDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId }: CancelDisputeVars) => studentDisputesService.cancelDispute(disputeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session-detail', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['student-disputes'] });
      toast.success('Dispute cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to cancel dispute';
      // Map known error messages
      if (message.includes('already exists')) {
        toast.error('An active dispute already exists for this session.');
      } else if (message.includes('can no longer be cancelled') || error?.response?.status === 400 || error?.response?.status === 409) {
        toast.error('This dispute can no longer be cancelled.');
      } else {
        toast.error(message);
      }
    },
  });
}
