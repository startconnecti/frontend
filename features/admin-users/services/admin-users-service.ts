import { adminApi } from '@/lib/admin-api/client';
import {
  AdminUsersListResponse,
  AdminUsersQueryParams,
} from '../types';
import { PAGINATION } from '@/constants/pagination';

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

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

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