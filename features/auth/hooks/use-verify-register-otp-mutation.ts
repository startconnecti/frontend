import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { VerifyRegisterOtpRequest, AuthError } from '../types';

export function useVerifyRegisterOtpMutation() {
  return useMutation<boolean, AuthError, VerifyRegisterOtpRequest>({
    mutationFn: (request) => authService.verifyRegisterOtp(request),
  });
}
