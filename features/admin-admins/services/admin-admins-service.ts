import { adminApi } from '@/lib/admin-api/client';
import type { AdminAccountListItem, AdminAccountsListResponse, AdminAccountsQueryParams } from '../types';

interface RawAdminItem {
  id?: string;
  adminId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
}

function normalizeAdminStatus(status?: string): 'active' | 'inactive' | 'suspended' {
  if (!status) return 'active';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'active' || lowerStatus === 'enabled') return 'active';
  if (lowerStatus === 'inactive' || lowerStatus === 'disabled') return 'inactive';
  if (lowerStatus === 'suspended') return 'suspended';
  return 'active';
}

function normalizeAdmin(item: RawAdminItem): AdminAccountListItem {
  return {
    id: item.id ?? item.adminId ?? '',
    fullName: item.fullName ?? item.name ?? '-',
    email: item.email ?? '-',
    role: (item.role?.toLowerCase() as any) ?? 'viewer',
    status: normalizeAdminStatus(item.status),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

export const adminAdminsService = {
  async listAdmins(params: AdminAccountsQueryParams): Promise<AdminAccountsListResponse> {
    const offset = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const limit = params.limit ?? 10;

    try {
      const response = await adminApi.get<{
        items: RawAdminItem[];
        pagination?: { limit: number; offset: number; total: number };
      }>('/admin/admins', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
        },
      });

      const total = response.data.pagination?.total ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        items: (response.data.items ?? []).map(normalizeAdmin),
        pagination: response.data.pagination,
        page: params.page ?? 1,
        totalPages,
      };
    } catch {
      return {
        items: [],
        pagination: { limit, offset: 0, total: 0 },
        page: params.page ?? 1,
        totalPages: 0,
      };
    }
  },
};
