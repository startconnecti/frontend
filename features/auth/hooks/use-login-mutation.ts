import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { LoginRequest, LoginResponse, AuthError } from '../types';

export function useLoginMutation() {
  return useMutation<LoginResponse, AuthError, LoginRequest>({
    mutationFn: (request) => authService.login(request),
  });
}
