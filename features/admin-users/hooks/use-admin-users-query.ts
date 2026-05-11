import { useQuery } from '@tanstack/react-query';
import { adminUsersService } from '../services/admin-users-service';
import { AdminUsersQueryParams } from '../types';

export function useAdminUsersQuery(
  params: AdminUsersQueryParams
) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminUsersService.getUsers(params),
  });
}