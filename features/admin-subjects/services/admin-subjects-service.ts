import { adminApi } from '@/lib/admin-api/client';
import type { AdminSubjectListItem, AdminSubjectsListResponse, AdminSubjectsQueryParams } from '../types';

interface RawSubjectItem {
  id?: string;
  subjectId?: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string | null;
}

function normalizeSubjectStatus(status?: string): 'active' | 'inactive' {
  if (!status) return 'active';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'active' || lowerStatus === 'enabled') return 'active';
  if (lowerStatus === 'inactive' || lowerStatus === 'disabled') return 'inactive';
  return 'active';
}

function normalizeSubject(item: RawSubjectItem | null | undefined): AdminSubjectListItem {
  if (!item) {
    return {
      id: '',
      name: '-',
      slug: '-',
      description: '-',
      status: 'inactive',
      createdAt: new Date(0).toISOString(),
      updatedAt: null,
    };
  }

  return {
    id: item.id ?? item.subjectId ?? '',
    name: item.name ?? '-',
    slug: item.slug ?? '-',
    description: item.description ?? '-',
    status: normalizeSubjectStatus(item.status),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
  };
}

export const adminSubjectsService = {
  async listSubjects(params: AdminSubjectsQueryParams): Promise<AdminSubjectsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const offset = (page - 1) * limit;

    const response = await adminApi.get<any>('/api/v1/admin/subjects', {
      params: {
        limit,
        offset,
        ...(params.keyword && { keyword: params.keyword }),
        ...(params.status && { status: params.status }),
      },
    });

    let rawItems: RawSubjectItem[] = [];
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
      items: rawItems.map(normalizeSubject),
      pagination: paginationData ?? { limit, offset, total },
      page,
      totalPages,
    };
  },
};
