'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import { PaymentFilters } from '../types';

export function useStudentPaymentsQuery(filters: PaymentFilters) {
  return useQuery({
    queryKey: ['student-payments', filters],
    queryFn: () => paymentService.getStudentPayments(filters),
  });
}
