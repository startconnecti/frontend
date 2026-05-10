import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { VerifyRegisterOtpRequest, AuthError, LoginResponse } from '../types';

export function useVerifyRegisterOtpMutation() {
  return useMutation<LoginResponse, AuthError, VerifyRegisterOtpRequest>({
    mutationFn: (request) => authService.verifyRegisterOtp(request),
  });
}
