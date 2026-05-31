import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminDisputesService } from '../services/admin-disputes-service';
import type {
  AdminDisputeDetailResponse,
  AdminDisputeListQueryParams,
  AdminDisputeListResponse,
} from '../types';

export function useAdminDisputesQuery(params: AdminDisputeListQueryParams) {
  return useQuery<AdminDisputeListResponse, Error>({
    queryKey: ['admin-disputes', params],
    queryFn: () => adminDisputesService.listDisputes(params),
    staleTime: 30000,
  });
}

export function useAdminDisputeDetailQuery(disputeId: string) {
  return useQuery<AdminDisputeDetailResponse, Error>({
    queryKey: ['admin-dispute-detail', disputeId],
    queryFn: () => adminDisputesService.getDisputeDetail(disputeId),
    enabled: !!disputeId,
  });
}

export function useAdminMarkReviewingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { disputeId: string; note?: string }>({
    mutationFn: ({ disputeId, note }) => adminDisputesService.markReviewing(disputeId, note),
    onSuccess: (_data, { disputeId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dispute-detail', disputeId] });
    },
  });
}

export function useAdminResolveDisputeMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { disputeId: string; resolutionType: string; resolutionNote?: string }
  >({
    mutationFn: ({ disputeId, resolutionType, resolutionNote }) =>
      adminDisputesService.resolveDispute(disputeId, resolutionType, resolutionNote),
    onSuccess: (_data, { disputeId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dispute-detail', disputeId] });
    },
  });
}

export function useAdminRejectDisputeMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { disputeId: string; reason?: string }>({
    mutationFn: ({ disputeId, reason }) => adminDisputesService.rejectDispute(disputeId, reason),
    onSuccess: (_data, { disputeId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dispute-detail', disputeId] });
    },
  });
}

export function useAdminCloseDisputeMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { disputeId: string; note?: string }>({
    mutationFn: ({ disputeId, note }) => adminDisputesService.closeDispute(disputeId, note),
    onSuccess: (_data, { disputeId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dispute-detail', disputeId] });
    },
  });
}
