'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking-service';
import { CreateBookingRequest } from '../types';
import { toast } from 'sonner';
import { handleMutationError } from '@/lib/api/query-utils';

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBookingRequest) => bookingService.createBooking(request),
    onSuccess: (data, variables) => {
      toast.success('Booking request sent successfully');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['tutors', 'detail', variables.tutorId] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to create booking');
    },
  });
}
