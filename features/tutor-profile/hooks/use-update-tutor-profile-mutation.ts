'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorProfileService } from '../services/tutor-profile-service';
import { UpdateTutorProfileRequest } from '../types';
import { toast } from 'sonner';

export function useUpdateTutorProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTutorProfileRequest) => tutorProfileService.updateTutorProfile(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['tutor-profile-management'], data);
      
      if (data.approvalStatus === 'approved') {
        toast.success('Profile update submitted for review');
      } else {
        toast.success('Profile updated successfully');
      }
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}
