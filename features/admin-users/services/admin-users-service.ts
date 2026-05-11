import { adminApi } from '@/lib/admin-api/client';
import {
  AdminUsersListResponse,
  AdminUsersQueryParams,
} from '../types';

type AdminUsersRequestParams = Record<string, string | number | boolean>;

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

  if (params.page) {
    requestParams.page = params.page;
  }

  if (params.limit) {
    requestParams.limit = params.limit;
  }

  return requestParams;
}

export const adminUsersService = {
  async getUsers(
    params: AdminUsersQueryParams
  ): Promise<AdminUsersListResponse> {
    return adminApi.get<AdminUsersListResponse>(
      '/api/v1/admin/users',
      {
        params: buildAdminUsersRequestParams(params),
      }
    );
  },
};