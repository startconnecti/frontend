'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite-service';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useRemoveFavoriteTutorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: string) => favoriteService.removeFavoriteTutor(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-tutors'] });
      toast.success('Tutor removed from favorites');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to remove tutor from favorites');
    },
  });
}
