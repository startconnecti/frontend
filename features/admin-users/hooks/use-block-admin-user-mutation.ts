import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '../services/admin-users-service';

export function useBlockAdminUserMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminUsersService.blockUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-user-detail', userId] });
    },
  });
}