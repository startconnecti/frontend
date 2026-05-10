'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';

export function usePaymentDetailQuery(id: string) {
  return useQuery({
    queryKey: ['payment-detail', id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });
}
