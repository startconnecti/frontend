import { useQuery } from '@tanstack/react-query';
import { adminAdminsService } from '../services/admin-admins-service';
import type { AdminAccountsQueryParams } from '../types';

export function useAdminAdminsQuery(params: AdminAccountsQueryParams) {
  return useQuery({
    queryKey: ['admin-admins', params],
    queryFn: () => adminAdminsService.listAdmins(params),
    staleTime: 30000,
  });
}
