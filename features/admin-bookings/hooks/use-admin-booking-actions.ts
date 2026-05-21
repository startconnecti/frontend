'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBookingsService } from '../services/admin-bookings-service';
import { toast } from 'sonner';

export function useConfirmBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminBookingsService.confirmBooking(id),
    onSuccess: (_, id) => {
      toast.success('Booking confirmed successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to confirm booking.');
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminBookingsService.cancelBooking(id, reason),
    onSuccess: (_, { id }) => {
      toast.success('Booking cancelled successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to cancel booking.');
    },
  });
}

export function useExpireBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminBookingsService.expireBooking(id),
    onSuccess: (_, id) => {
      toast.success('Booking expired successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to expire booking.');
    },
  });
}
