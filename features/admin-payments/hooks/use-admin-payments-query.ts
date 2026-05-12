import { useQuery } from '@tanstack/react-query';
import { getAdminPayments } from '../services/admin-payments-service';
import type { AdminPaymentListQueryParams } from '../types';

export function useAdminPaymentsQuery(params: AdminPaymentListQueryParams = {}) {
  return useQuery({
    queryKey: ['admin-payments', params],
    queryFn: () => getAdminPayments(params),
    staleTime: 30000,
  });
}
