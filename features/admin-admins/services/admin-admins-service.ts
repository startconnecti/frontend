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

type AdminRoleValue = 'super_admin' | 'admin' | 'moderator' | 'finance' | 'support' | 'viewer';

function normalizeAdminRole(role?: string): AdminRoleValue {
  const allowed: AdminRoleValue[] = ['super_admin', 'admin', 'moderator', 'finance', 'support', 'viewer'];
  const lower = role?.toLowerCase() as AdminRoleValue | undefined;
  return lower && allowed.includes(lower) ? lower : 'viewer';
}

function normalizeAdmin(item: RawAdminItem | null | undefined): AdminAccountListItem {
  if (!item) {
    return {
      id: '',
      fullName: '-',
      email: '-',
      role: 'viewer',
      status: 'active',
      createdAt: new Date(0).toISOString(),
    };
  }

  return {
    id: item.id ?? item.adminId ?? '',
    fullName: item.fullName ?? item.name ?? '-',
    email: item.email ?? '-',
    role: normalizeAdminRole(item.role),
    status: normalizeAdminStatus(item.status),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

function extractRawAdmin(response: unknown): RawAdminItem {
  const res = response as Record<string, unknown>;
  if (res?.admin && typeof res.admin === 'object') return res.admin as RawAdminItem;
  const data = res?.data as Record<string, unknown> | undefined;
  if (data?.admin && typeof data.admin === 'object') return data.admin as RawAdminItem;
  if (data && typeof data === 'object' && data.id) return data as RawAdminItem;
  return res as RawAdminItem;
}

export const adminAdminsService = {
  async listAdmins(params: AdminAccountsQueryParams): Promise<AdminAccountsListResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    const response = await adminApi.get<unknown>('/api/v1/admin/admins', {
      params: {
        limit,
        offset,
        ...(params.keyword && { keyword: params.keyword }),
      },
    });

    const res = response as Record<string, unknown>;
    let rawItems: RawAdminItem[] = [];
    let total = 0;
    let paginationData = null;

    if (Array.isArray(res)) {
      rawItems = res as RawAdminItem[];
      total = rawItems.length;
    } else if (res && typeof res === 'object') {
      rawItems = (res.items as RawAdminItem[]) ?? (res.data as RawAdminItem[]) ?? [];
      paginationData = res.pagination as { limit: number; offset: number; total: number } | null;
      total = paginationData?.total ?? rawItems.length;
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items: rawItems.map(normalizeAdmin),
      pagination: paginationData ?? { limit, offset, total },
      page,
      totalPages,
    };
  },

  async getAdminById(id: string): Promise<AdminAccountListItem> {
    const response = await adminApi.get<unknown>(`/api/v1/admin/admins/${id}`);
    return normalizeAdmin(extractRawAdmin(response));
  },

  async createAdmin(data: {
    fullName: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }): Promise<AdminAccountListItem> {
    const response = await adminApi.post<unknown>('/api/v1/admin/admins', data);
    return normalizeAdmin(extractRawAdmin(response));
  },

  async updateAdmin(
    id: string,
    data: { fullName?: string; email?: string; role?: string; status?: string; password?: string },
  ): Promise<AdminAccountListItem> {
    const response = await adminApi.patch<unknown>(`/api/v1/admin/admins/${id}`, data);
    return normalizeAdmin(extractRawAdmin(response));
  },
};
