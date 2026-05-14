'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';

export function usePaymentDetailQuery(id: string) {
  return useQuery({
    queryKey: ['payment-detail', id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'pending' || data.status === 'processing')) {
        return 2000;
      }
      return false;
    },
  });
}
