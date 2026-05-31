import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminPayoutsService } from '../services/admin-payouts-service';
import type { AdminPayoutListQueryParams, AdminPayoutListResponse, AdminPayoutDetailResponse } from '../types';

export function useAdminPayoutsQuery(params: AdminPayoutListQueryParams) {
  return useQuery<AdminPayoutListResponse, Error>({
    queryKey: ['admin-payouts', params],
    queryFn: () => adminPayoutsService.listPayouts(params),
    staleTime: 30000,
  });
}

export function useAdminPayoutDetailQuery(payoutId: string) {
  return useQuery<AdminPayoutDetailResponse, Error>({
    queryKey: ['admin-payout-detail', payoutId],
    queryFn: () => adminPayoutsService.getPayoutDetail(payoutId),
    enabled: !!payoutId,
  });
}

export function useAdminApprovePayoutMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { payoutId: string; note?: string }>({
    mutationFn: ({ payoutId, note }) => adminPayoutsService.approvePayout(payoutId, note),
    onSuccess: (_data, { payoutId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-payout-detail', payoutId] });
    },
  });
}

export function useAdminMarkPayoutProcessingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { payoutId: string; note?: string }>({
    mutationFn: ({ payoutId, note }) => adminPayoutsService.markPayoutProcessing(payoutId, note),
    onSuccess: (_data, { payoutId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-payout-detail', payoutId] });
    },
  });
}

export function useAdminMarkPayoutPaidMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { payoutId: string; note?: string }>({
    mutationFn: ({ payoutId, note }) => adminPayoutsService.markPayoutPaid(payoutId, note),
    onSuccess: (_data, { payoutId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-payout-detail', payoutId] });
    },
  });
}

export function useAdminCancelPayoutMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { payoutId: string; reason?: string }>({
    mutationFn: ({ payoutId, reason }) => adminPayoutsService.cancelPayout(payoutId, reason),
    onSuccess: (_data, { payoutId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-payout-detail', payoutId] });
    },
  });
}
