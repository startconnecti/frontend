import { useQuery } from '@tanstack/react-query';
import { adminRolesService } from '../services/admin-roles-service';
import type { AdminRolesQueryParams } from '../types';

export function useAdminRolesQuery(params: AdminRolesQueryParams) {
  return useQuery({
    queryKey: ['admin-roles', params],
    queryFn: () => adminRolesService.listRoles(params),
    staleTime: 60000,
  });
}
