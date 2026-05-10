'use client';

import { useMutation } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { ChangePasswordRequest } from '../types';
import { toast } from 'sonner';

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => settingsService.changePassword(request),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: () => {
      toast.error('Failed to change password');
    },
  });
}
