'use client';

import { useMutation } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { ChangePasswordRequest } from '../types';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => settingsService.changePassword(request),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to change password');
    },
  });
}
