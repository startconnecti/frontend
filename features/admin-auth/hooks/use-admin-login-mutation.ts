import { useMutation } from '@tanstack/react-query';
import { adminAuthService } from '../services/admin-auth-service';

export function useAdminLoginMutation() {
  return useMutation({
    mutationFn: adminAuthService.login,
  });
}