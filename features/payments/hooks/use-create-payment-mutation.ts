'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment-service';
import { toast } from 'sonner';
import { handleMutationError } from '@/lib/api/query-utils';
import { ApiError } from '@/lib/api/errors';

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => paymentService.createPayment(bookingId),
    onSuccess: (data) => {
      toast.success('Payment initialized');
      // Explicitly invalidate student-bookings to reflect status change to payment_processing
      queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      if (ApiError.isApiError(error)) {
        if (error.code === 'Payment.BookingNotPayable') {
          toast.error('Payment Failed', {
            description: 'This booking is no longer payable.',
          });
          return;
        }
        if (error.code === 'Payment.AlreadyExists') {
          toast.error('Payment Pending', {
            description: 'A payment record already exists for this booking.',
          });
          return;
        }
      }
      handleMutationError(error, 'Failed to initialize payment');
    },
  });
}
