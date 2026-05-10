import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { RegisterCredentialsRequest, AuthError } from '../types';

export function useRegisterCredentialsMutation() {
  return useMutation<boolean, AuthError, RegisterCredentialsRequest>({
    mutationFn: (request) => authService.registerCredentials(request),
  });
}
