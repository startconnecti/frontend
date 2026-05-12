import { useQuery } from '@tanstack/react-query';
import { getAdminRefunds } from '../services/admin-refunds-service';
import type { AdminRefundListQueryParams } from '../types';

export function useAdminRefundsQuery(params: AdminRefundListQueryParams = {}) {
  return useQuery({
    queryKey: ['admin-refunds', params],
    queryFn: () => getAdminRefunds(params),
    staleTime: 30000,
  });
}
