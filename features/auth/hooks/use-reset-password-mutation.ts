import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { ResetPasswordRequest, AuthError } from '../types';

export function useResetPasswordMutation() {
  return useMutation<boolean, AuthError, ResetPasswordRequest>({
    mutationFn: (request) => authService.resetPassword(request),
  });
}
