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

function normalizeAdmin(item: RawAdminItem | null | undefined): AdminAccountListItem {
  if (!item) {
    return {
      id: '',
      fullName: '-',
      email: '-',
      role: 'viewer' as any,
      status: 'active',
      createdAt: new Date(0).toISOString(),
    };
  }

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
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      const response = await adminApi.get<any>('/api/v1/admin/admins', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
        },
      });

      let rawItems: RawAdminItem[] = [];
      let total = 0;
      let paginationData = null;

      if (Array.isArray(response)) {
        rawItems = response;
        total = response.length;
      } else if (response && typeof response === 'object') {
        rawItems = response.items ?? response.data ?? [];
        paginationData = response.pagination;
        total = paginationData?.total ?? rawItems.length;
      }

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        items: rawItems.map(normalizeAdmin),
        pagination: paginationData ?? { limit, offset, total },
        page,
        totalPages,
      };
    } catch {
      return {
        items: [],
        pagination: { limit, offset: 0, total: 0 },
        page,
        totalPages: 0,
      };
    }
  },
};
