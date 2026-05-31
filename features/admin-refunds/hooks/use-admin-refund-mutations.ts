import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveAdminRefund, rejectAdminRefund } from '../services/admin-refunds-service';

export function useApproveAdminRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveAdminRefund(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['admin-refund-detail', variables.id] });
    },
  });
}

export function useRejectAdminRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectAdminRefund(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['admin-refund-detail', variables.id] });
    },
  });
}
