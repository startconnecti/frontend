import { useQuery } from '@tanstack/react-query';
import { adminUsersService } from '../services/admin-users-service';

export function useAdminUserDetailQuery(userId: string) {
  return useQuery({
    queryKey: ['admin-user-detail', userId],
    queryFn: () => adminUsersService.getUserById(userId),
    enabled: Boolean(userId),
  });
}