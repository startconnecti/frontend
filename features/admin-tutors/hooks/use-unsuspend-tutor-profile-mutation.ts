import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';
import { UnsuspendTutorProfileRequest } from '../types';

export function useUnsuspendTutorProfileMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UnsuspendTutorProfileRequest) =>
      adminTutorsService.unsuspendTutorProfile(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-tutor-detail', id] });
    },
  });
}