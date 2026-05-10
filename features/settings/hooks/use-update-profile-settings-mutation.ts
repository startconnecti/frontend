'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { UpdateProfileRequest } from '../types';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/auth-store';

import { handleMutationError } from '@/lib/api/query-utils';

export function useUpdateProfileSettingsMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => settingsService.updateProfileSettings(request),
    onSuccess: (data) => {
      // Synchronize Zustand auth store
      updateUser({
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      });
      
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to update profile');
    },
  });
}
