import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { ForgotPasswordRequest, AuthError } from '../types';

export function useForgotPasswordRequestMutation() {
  return useMutation<boolean, AuthError, ForgotPasswordRequest>({
    mutationFn: (request) => authService.requestForgotPassword(request),
  });
}
