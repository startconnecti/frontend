import { useQuery } from '@tanstack/react-query';
import { adminPayoutsService } from '../services/admin-payouts-service';
import type { AdminPayoutListQueryParams, AdminPayoutListResponse } from '../types';

export function useAdminPayoutsQuery(params: AdminPayoutListQueryParams) {
  return useQuery<AdminPayoutListResponse, Error>({
    queryKey: ['admin-payouts', params],
    queryFn: () => adminPayoutsService.listPayouts(params),
    staleTime: 30000,
  });
}
