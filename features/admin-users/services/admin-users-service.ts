import { PAGINATION } from '@/constants/pagination';
import { adminApi } from '@/lib/admin-api/client';
import {
  AdminUser,
  AdminUserDetail,
  AdminUserMutationResponse,
  AdminUserRole,
  AdminUserStatus,
  AdminUsersListResponse,
  AdminUsersQueryParams,
} from '../types';

type AdminUsersRequestParams = Record<string, string | number | boolean>;

interface RawAdminUserListItem {
  userId?: string;
  id?: string;
  email?: string;
  fullName?: string | null;
  name?: string | null;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

interface RawAdminUsersListResponse {
  items?: RawAdminUserListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

interface RawAdminUserDetailResponse {
  user?: RawAdminUserListItem & {
    phone?: string | null;
    dob?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    avatar?: string | null;
  };
  tutorProfileSummary?: unknown;
}

function isAdminUserRole(role: string | undefined): role is AdminUserRole {
  return role === 'student' || role === 'tutor';
}

function isAdminUserStatus(status: string | undefined): status is AdminUserStatus {
  return status === 'active' || status === 'inactive' || status === 'blocked';
}

function normalizeUser(item: RawAdminUserListItem): AdminUser {
  const id = item.id ?? item.userId ?? '';

  return {
    id,
    fullName: item.fullName ?? item.name ?? '-',
    email: item.email ?? '-',
    role: isAdminUserRole(item.role) ? item.role : 'student',
    status: isAdminUserStatus(item.status) ? item.status : 'inactive',
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
    lastLoginAt: item.lastLoginAt ?? null,
  };
}

function normalizeUserDetail(response: RawAdminUserDetailResponse): AdminUserDetail {
  const rawUser = response.user;

  if (!rawUser) {
    throw new Error('User detail response is missing user data');
  }

  const normalizedUser = normalizeUser(rawUser);

  return {
    ...normalizedUser,
    phone: rawUser.phone ?? null,
    avatar: rawUser.avatar ?? null,
    dateOfBirth: rawUser.dateOfBirth ?? rawUser.dob ?? null,
    gender: rawUser.gender ?? null,
  };
}

function normalizeUsersListResponse(
  response: RawAdminUsersListResponse,
  page: number,
  fallbackLimit: number
): AdminUsersListResponse {
  const items = response.items ?? [];
  const pagination = response.pagination;

  const limit = pagination?.limit ?? fallbackLimit;
  const offset = pagination?.offset ?? (page - 1) * limit;
  const total = pagination?.total ?? items.length;

  return {
    items: items.map(normalizeUser).filter((user) => Boolean(user.id)),
    total,
    page,
    limit,
    offset,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function buildAdminUsersRequestParams(
  params: AdminUsersQueryParams
): AdminUsersRequestParams {
  const requestParams: AdminUsersRequestParams = {};

  if (params.keyword) {
    requestParams.keyword = params.keyword;
  }

  if (params.role) {
    requestParams.role = params.role;
  }

  if (params.status) {
    requestParams.status = params.status;
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0
      ? params.limit
      : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

  return requestParams;
}

export const adminUsersService = {
  async getUsers(params: AdminUsersQueryParams): Promise<AdminUsersListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit =
      params.limit && params.limit > 0
        ? params.limit
        : PAGINATION.DEFAULT_PAGE_SIZE;

    const response = await adminApi.get<RawAdminUsersListResponse>(
      '/api/v1/admin/users',
      {
        params: buildAdminUsersRequestParams(params),
      }
    );

    return normalizeUsersListResponse(response, page, limit);
  },

  async getUserById(userId: string): Promise<AdminUserDetail> {
    const response = await adminApi.get<RawAdminUserDetailResponse>(
      `/api/v1/admin/users/${userId}`
    );

    return normalizeUserDetail(response);
  },

  async blockUser(userId: string): Promise<AdminUserMutationResponse> {
    return adminApi.post<AdminUserMutationResponse>(
      `/api/v1/admin/users/${userId}/block`
    );
  },

  async unblockUser(userId: string): Promise<AdminUserMutationResponse> {
    return adminApi.post<AdminUserMutationResponse>(
      `/api/v1/admin/users/${userId}/unblock`
    );
  },
};