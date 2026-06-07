'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorAvailabilityService } from '../services/tutor-availability-service';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useDeleteTutorAvailabilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tutorAvailabilityService.deleteTutorAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-availability'] });
      toast.success('Availability slot removed successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to remove availability slot');
    },
  });
}
