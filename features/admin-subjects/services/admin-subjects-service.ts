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

function normalizeSubject(item: RawSubjectItem): AdminSubjectListItem {
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
    const offset = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const limit = params.limit ?? 10;

    const response = await adminApi.get<{
      items: RawSubjectItem[];
      pagination: { limit: number; offset: number; total: number };
    }>('/admin/subjects', {
      params: {
        limit,
        offset,
        ...(params.keyword && { keyword: params.keyword }),
        ...(params.status && { status: params.status }),
      },
    });

    const total = response.data.pagination?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items: (response.data.items ?? []).map(normalizeSubject),
      pagination: response.data.pagination ?? { limit, offset, total },
      page: params.page ?? 1,
      totalPages,
    };
  },
};
