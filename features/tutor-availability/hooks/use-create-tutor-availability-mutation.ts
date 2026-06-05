'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorAvailabilityService } from '../services/tutor-availability-service';
import { CreateAvailabilityRequest } from '../types';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useCreateTutorAvailabilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAvailabilityRequest) => tutorAvailabilityService.createTutorAvailability(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-availability'] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to create availability slot');
    },
  });
}
