'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import { toast } from 'sonner';

export function useMarkPaymentSuccessMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentService.markPaymentSuccess(paymentId),
    onSuccess: () => {
      toast.success('Payment marked as transferred successfully. Waiting for admin review.');
      queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['student-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update payment status');
    }
  });
}
