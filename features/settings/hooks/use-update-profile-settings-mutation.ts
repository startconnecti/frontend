'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { UpdateProfileRequest } from '../types';
import { toast } from 'sonner';

export function useUpdateProfileSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => settingsService.updateProfileSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}
