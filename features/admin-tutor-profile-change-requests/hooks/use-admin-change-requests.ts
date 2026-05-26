import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminChangeRequestService } from '../services/admin-change-request-service';
import { AdminChangeRequestsQueryParams } from '../types';

export const ADMIN_CHANGE_REQUESTS_KEY = ['admin-change-requests'];
export const ADMIN_CHANGE_REQUEST_DETAIL_KEY = ['admin-change-request-detail'];

export function useAdminChangeRequestsQuery(params: AdminChangeRequestsQueryParams) {
  return useQuery({
    queryKey: [...ADMIN_CHANGE_REQUESTS_KEY, params],
    queryFn: () => adminChangeRequestService.getChangeRequests(params),
  });
}

export function useAdminChangeRequestDetailQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...ADMIN_CHANGE_REQUEST_DETAIL_KEY, id],
    queryFn: () => adminChangeRequestService.getChangeRequestDetail(id),
    ...options,
  });
}

export function useApproveChangeRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminChangeRequestService.approveChangeRequest(id, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CHANGE_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_CHANGE_REQUEST_DETAIL_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-profile'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useRejectChangeRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminChangeRequestService.rejectChangeRequest(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CHANGE_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_CHANGE_REQUEST_DETAIL_KEY, variables.id] });
    },
  });
}
