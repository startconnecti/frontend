import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { VerifyForgotPasswordOtpRequest, AuthError } from '../types';

export function useVerifyForgotPasswordOtpMutation() {
  return useMutation<boolean, AuthError, VerifyForgotPasswordOtpRequest>({
    mutationFn: (request) => authService.verifyForgotPasswordOtp(request),
  });
}
