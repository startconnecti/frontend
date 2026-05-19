'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tutorId, isFavorite }: { tutorId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        return api.delete(`/api/v1/me/favorite-tutors/${tutorId}`);
      } else {
        return api.post(`/api/v1/me/favorite-tutors/${tutorId}`, {});
      }
    },
    onMutate: async ({ tutorId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['tutors'] });

      const previousTutors = queryClient.getQueryData(['tutors']);

      queryClient.setQueryData(['tutors'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items?.map((tutor: any) => 
            tutor.id === tutorId ? { ...tutor, isFavorite: !isFavorite } : tutor
          )
        };
      });

      return { previousTutors };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousTutors) {
        queryClient.setQueryData(['tutors'], context.previousTutors);
      }
      toast.error('Failed to update favorite status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-tutors'] });
    },
  });
}
