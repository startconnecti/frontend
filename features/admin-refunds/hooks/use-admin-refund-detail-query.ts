import { useQuery } from '@tanstack/react-query';
import { getAdminRefundDetail } from '../services/admin-refunds-service';

export function useAdminRefundDetailQuery(id: string) {
  return useQuery({
    queryKey: ['admin-refund-detail', id],
    queryFn: () => getAdminRefundDetail(id),
    enabled: !!id,
  });
}
