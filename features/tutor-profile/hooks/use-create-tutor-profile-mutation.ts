import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorProfileService } from '../services/tutor-profile-service';
import { CreateTutorProfileRequest } from '../types';

import { toast } from 'sonner';

export function useCreateTutorProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTutorProfileRequest) => tutorProfileService.createTutorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-profile-management'] });
      toast.success('Tutor profile created successfully');
    },
    onError: () => {
      toast.error('Failed to create tutor profile');
    },
  });
}
