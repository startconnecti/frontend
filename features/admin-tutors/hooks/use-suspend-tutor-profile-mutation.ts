import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';
import { SuspendTutorProfileRequest } from '../types';

export function useSuspendTutorProfileMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SuspendTutorProfileRequest) =>
      adminTutorsService.suspendTutorProfile(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-tutor-detail', id] });
    },
  });
}