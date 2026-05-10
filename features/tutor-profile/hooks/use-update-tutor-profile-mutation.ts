'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorProfileService } from '../services/tutor-profile-service';
import { UpdateTutorProfileRequest } from '../types';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';
import { useAuthStore } from '@/stores/auth-store';

export function useUpdateTutorProfileMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (request: UpdateTutorProfileRequest) => tutorProfileService.updateTutorProfile(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['tutor-profile-management'], data);
      
      // Sync AuthStore
      updateUser({
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber,
      });
      
      if (data.approvalStatus === 'pending') {
        toast.success('Profile update submitted for review');
      } else {
        toast.success('Profile updated successfully');
      }
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to update profile');
    },
  });
}
