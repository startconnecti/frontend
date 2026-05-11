import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '../services/admin-users-service';

export function useUnblockAdminUserMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminUsersService.unblockUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-user-detail', userId] });
    },
  });
}