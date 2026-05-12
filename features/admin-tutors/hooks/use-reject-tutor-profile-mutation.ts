import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';
import { RejectTutorProfileRequest } from '../types';

export function useRejectTutorProfileMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectTutorProfileRequest) =>
      adminTutorsService.rejectTutorProfile(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-tutor-detail', id] });
    },
  });
}