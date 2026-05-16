'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking-service';
import { CancelBookingPayload } from '../types';
import { getErrorMessage } from '@/lib/api/query-utils';
import { toast } from 'sonner';

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: CancelBookingPayload }) =>
      bookingService.cancelBooking(bookingId, payload),
    onSuccess: () => {
      // Invalidate all student bookings queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel booking', {
        description: getErrorMessage(error),
      });
    },
  });
}
