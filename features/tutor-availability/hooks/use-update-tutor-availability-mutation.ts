'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorAvailabilityService } from '../services/tutor-availability-service';
import { UpdateAvailabilityRequest } from '../types';
import { toast } from 'sonner';

export function useUpdateTutorAvailabilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAvailabilityRequest) => tutorAvailabilityService.updateTutorAvailability(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['tutor-availability'], data);
      toast.success('Availability updated successfully');
    },
    onError: () => {
      toast.error('Failed to update availability');
    },
  });
}
