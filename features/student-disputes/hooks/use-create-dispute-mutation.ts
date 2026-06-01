import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentDisputesService } from '../services/student-disputes.service';
import { StudentDisputeCreateRequest } from '../types';

export function useCreateDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentDisputeCreateRequest) => studentDisputesService.createDispute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session-detail', variables.session_id] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['student-disputes'] });
      toast.success('Dispute submitted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to submit dispute';
      toast.error(message);
    },
  });
}
