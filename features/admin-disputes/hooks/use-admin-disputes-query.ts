import { useQuery } from '@tanstack/react-query';
import { adminDisputesService } from '../services/admin-disputes-service';
import type { AdminDisputeListQueryParams, AdminDisputeListResponse } from '../types';

export function useAdminDisputesQuery(params: AdminDisputeListQueryParams) {
  return useQuery<AdminDisputeListResponse, Error>({
    queryKey: ['admin-disputes', params],
    queryFn: () => adminDisputesService.listDisputes(params),
    staleTime: 30000,
  });
}
