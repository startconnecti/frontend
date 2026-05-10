'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import { CreatePaymentRequest } from '../types';
import { toast } from 'sonner';
import { handleMutationError } from '@/lib/api/query-utils';

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => paymentService.createPayment(request),
    onSuccess: (data) => {
      toast.success('Payment initialized');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to initialize payment');
    },
  });
}
