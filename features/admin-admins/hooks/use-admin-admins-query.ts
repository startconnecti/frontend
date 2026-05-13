import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAdminsService } from '../services/admin-admins-service';
import type { AdminAccountsQueryParams } from '../types';

export const ADMIN_ADMINS_KEYS = {
  all: ['admin-admins'] as const,
  lists: () => [...ADMIN_ADMINS_KEYS.all, 'list'] as const,
  list: (params: AdminAccountsQueryParams) => [...ADMIN_ADMINS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_ADMINS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_ADMINS_KEYS.details(), id] as const,
};

export function useAdminAdminsQuery(params: AdminAccountsQueryParams) {
  return useQuery({
    queryKey: ADMIN_ADMINS_KEYS.list(params),
    queryFn: () => adminAdminsService.listAdmins(params),
    staleTime: 30000,
  });
}

export function useAdminAdminDetailQuery(id: string) {
  return useQuery({
    queryKey: ADMIN_ADMINS_KEYS.detail(id),
    queryFn: () => adminAdminsService.getAdminById(id),
    enabled: !!id,
  });
}

export function useCreateAdminAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName: string; email: string; role: string; status: string; password?: string }) =>
      adminAdminsService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ADMINS_KEYS.lists() });
    },
  });
}

export function useUpdateAdminAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { fullName?: string; email?: string; role?: string; status?: string; password?: string };
    }) => adminAdminsService.updateAdmin(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ADMINS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_ADMINS_KEYS.detail(result.id) });
    },
  });
}
