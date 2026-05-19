'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { handleMutationError } from '@/lib/api/query-utils';

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (file: File) => settingsService.uploadAvatar(file),
    onSuccess: (data) => {
      // Synchronize Zustand auth store
      updateUser({
        avatarUrl: data.avatarUrl,
      });

      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      toast.success('Avatar uploaded successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to upload avatar');
    },
  });
}
