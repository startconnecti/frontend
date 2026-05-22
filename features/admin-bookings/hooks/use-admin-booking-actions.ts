'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBookingsService } from '../services/admin-bookings-service';
import { toast } from 'sonner';

export function useConfirmBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminBookingsService.confirmBooking(id),
    onSuccess: (response, id) => {
      toast.success('Booking confirmed successfully.');
      
      const warningMessage = response?.warning || response?.data?.warning || response?.reason || response?.data?.reason;
      if (warningMessage) {
        toast.warning('Warning', { description: warningMessage, duration: 8000 });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
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
    onSuccess: (response, { id }) => {
      toast.success('Booking cancelled successfully.');

      const warningMessage = response?.warning || response?.data?.warning || response?.reason || response?.data?.reason;
      if (warningMessage) {
        toast.warning('Warning', { description: warningMessage, duration: 8000 });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
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
    onSuccess: (response, id) => {
      toast.success('Booking expired successfully.');

      const warningMessage = response?.warning || response?.data?.warning || response?.reason || response?.data?.reason;
      if (warningMessage) {
        toast.warning('Warning', { description: warningMessage, duration: 8000 });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to expire booking.');
    },
  });
}
