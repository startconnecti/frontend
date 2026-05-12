import { adminApi } from '@/lib/admin-api/client';
import type { AdminRoleItem, AdminRolesListResponse, AdminRolesQueryParams } from '../types';

interface RawRoleItem {
  id?: string;
  roleId?: string;
  name?: string;
  description?: string;
  permissions?: Record<string, string[]>;
  createdAt?: string;
}

function normalizeRole(item: RawRoleItem): AdminRoleItem {
  return {
    id: item.id ?? item.roleId ?? '',
    name: item.name ?? '-',
    description: item.description ?? '-',
    permissions: item.permissions ?? {},
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

export const adminRolesService = {
  async listRoles(params: AdminRolesQueryParams): Promise<AdminRolesListResponse> {
    const limit = params.limit ?? 10;
    const offset = params.page && params.limit ? (params.page - 1) * params.limit : 0;

    try {
      const response = await adminApi.get<{
        items: RawRoleItem[];
        pagination?: { limit: number; offset: number; total: number };
      }>('/api/v1/admin/roles', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
        },
      });

      return {
        items: (response.data.items ?? []).map(normalizeRole),
        pagination: response.data.pagination,
      };
    } catch {
      return {
        items: [],
        pagination: { limit, offset: 0, total: 0 },
      };
    }
  },
};
