import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';
import { ApproveTutorProfileRequest } from '../types';

export function useApproveTutorProfileMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveTutorProfileRequest) =>
      adminTutorsService.approveTutorProfile(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-tutor-detail', id] });
    },
  });
}