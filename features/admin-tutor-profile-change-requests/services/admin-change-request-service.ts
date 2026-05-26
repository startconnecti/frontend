import { PAGINATION } from '@/constants/pagination';
import { adminApi } from '@/lib/admin-api/client';
import {
  AdminChangeRequestsListResponse,
  AdminChangeRequestsQueryParams,
  AdminTutorProfileChangeRequest,
  AdminTutorProfileChangeRequestDetail,
} from '../types';

type RequestParams = Record<string, string | number | boolean>;

interface RawListResponse {
  items?: AdminTutorProfileChangeRequest[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

function buildRequestParams(params: AdminChangeRequestsQueryParams): RequestParams {
  const requestParams: RequestParams = {};

  if (params.status) {
    requestParams.status = params.status;
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

  return requestParams;
}

function normalizeListResponse(response: any, page: number, fallbackLimit: number): AdminChangeRequestsListResponse {
  let rawItems: AdminTutorProfileChangeRequest[] = [];
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

  const limit = paginationData?.limit ?? fallbackLimit;
  const offset = paginationData?.offset ?? (page - 1) * limit;

  return {
    items: rawItems,
    total,
    page,
    limit,
    offset,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export const adminChangeRequestService = {
  async getChangeRequests(params: AdminChangeRequestsQueryParams): Promise<AdminChangeRequestsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

    const response = await adminApi.get<RawListResponse>('/api/v1/admin/tutor-profile-change-requests', {
      params: buildRequestParams(params),
    });

    return normalizeListResponse(response, page, limit);
  },

  async getChangeRequestDetail(id: string): Promise<AdminTutorProfileChangeRequestDetail> {
    const response = await adminApi.get<any>(`/api/v1/admin/tutor-profile-change-requests/${id}`);
    
    const request = response.request || response;

    if (!request) {
      throw new Error('Change request detail is missing in the response');
    }

    return request as AdminTutorProfileChangeRequestDetail;
  },

  async approveChangeRequest(id: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/tutor-profile-change-requests/${id}/approve`, {
      note,
    });
  },

  async rejectChangeRequest(id: string, reason: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/tutor-profile-change-requests/${id}/reject`, {
      reason,
    });
  },
};
