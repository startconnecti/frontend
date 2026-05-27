'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking-service';
import { CancelBookingPayload } from '../types';
import { getErrorMessage } from '@/lib/api/query-utils';
import { toast } from 'sonner';

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload, tutorId }: { bookingId: string; payload: CancelBookingPayload; tutorId?: string }) =>
      bookingService.cancelBooking(bookingId, payload),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries safely
      queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      
      if (variables.tutorId) {
        queryClient.invalidateQueries({ queryKey: ['tutors', 'detail', variables.tutorId] });
      }
      
      if (data?.booking?.refundCreated) {
        toast.success('Booking cancelled successfully. Your refund request is pending admin review.');
      } else {
        toast.success('Booking cancelled successfully');
      }
    },
    onError: (error: any) => {
      const code = error?.code || '';
      let message = 'Failed to cancel booking';

      if (code === 'Booking.PaymentProcessing') {
        message = 'Payment is currently processing. Please wait a moment and try again.';
      } else if (code === 'Booking.CannotCancelApprovedBooking') {
        message = 'This booking has already been approved. Please cancel the session instead.';
      } else if (code === 'Booking.AlreadyCancelled') {
        message = 'This booking has already been cancelled.';
      }

      toast.error(message, {
        description: getErrorMessage(error),
      });
    },
  });
}
