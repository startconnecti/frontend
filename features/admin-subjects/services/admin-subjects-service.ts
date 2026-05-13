import { adminApi } from '@/lib/admin-api/client';
import type { AdminSubjectListItem, AdminSubjectsListResponse, AdminSubjectsQueryParams } from '../types';

interface RawSubjectItem {
  id?: string;
  subjectId?: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

function normalizeSubjectStatus(item: RawSubjectItem): 'active' | 'inactive' {
  // Prefer explicit `status` field first
  if (item.status) {
    const s = item.status.toLowerCase();
    if (s === 'active' || s === 'enabled') return 'active';
    if (s === 'inactive' || s === 'disabled') return 'inactive';
  }
  // Fall back to boolean `isActive` (actual backend field)
  if (typeof item.isActive === 'boolean') {
    return item.isActive ? 'active' : 'inactive';
  }
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
    status: normalizeSubjectStatus(item),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
  };
}

/**
 * Unwraps the raw API response to find the subject object.
 * Handles shapes:
 *   - { subject: {...} }
 *   - { data: { subject: {...} } }
 *   - { data: {...} }  (direct subject)
 *   - {...}            (direct subject)
 */
function extractRawSubject(response: unknown): RawSubjectItem {
  const res = response as Record<string, unknown>;

  // { subject: {...} }  — what the actual backend returns
  if (res?.subject && typeof res.subject === 'object') {
    return res.subject as RawSubjectItem;
  }

  // { data: { subject: {...} } }
  const data = res?.data as Record<string, unknown> | undefined;
  if (data?.subject && typeof data.subject === 'object') {
    return data.subject as RawSubjectItem;
  }

  // { data: {...} }  — direct subject inside data wrapper
  if (data && typeof data === 'object' && data.id) {
    return data as RawSubjectItem;
  }

  // Direct subject object
  return res as RawSubjectItem;
}

export const adminSubjectsService = {
  async listSubjects(params: AdminSubjectsQueryParams): Promise<AdminSubjectsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const offset = (page - 1) * limit;

    const response = await adminApi.get<unknown>('/api/v1/admin/subjects', {
      params: {
        limit,
        offset,
        ...(params.keyword && { keyword: params.keyword }),
        ...(params.status && { status: params.status }),
      },
    });

    const res = response as Record<string, unknown>;
    let rawItems: RawSubjectItem[] = [];
    let total = 0;
    let paginationData = null;

    if (Array.isArray(res)) {
      rawItems = res as RawSubjectItem[];
      total = rawItems.length;
    } else if (res && typeof res === 'object') {
      rawItems = (res.items as RawSubjectItem[]) ?? (res.data as RawSubjectItem[]) ?? [];
      paginationData = res.pagination as { limit: number; offset: number; total: number } | null;
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

  async getSubjectById(id: string): Promise<AdminSubjectListItem> {
    const response = await adminApi.get<unknown>(`/api/v1/admin/subjects/${id}`);
    return normalizeSubject(extractRawSubject(response));
  },

  async createSubject(data: {
    name: string;
    slug: string;
    description?: string;
    status: string;
  }): Promise<AdminSubjectListItem> {
    // Backend uses `isActive`, map from our internal `status` field
    const payload: Record<string, unknown> = {
      name: data.name,
      slug: data.slug,
      ...(data.description !== undefined && { description: data.description }),
      isActive: data.status === 'active',
    };

    const response = await adminApi.post<unknown>('/api/v1/admin/subjects', payload);
    return normalizeSubject(extractRawSubject(response));
  },

  async updateSubject(
    id: string,
    data: { name?: string; slug?: string; description?: string; status?: string },
  ): Promise<AdminSubjectListItem> {
    // Backend uses `isActive`, map from our internal `status` field
    const payload: Record<string, unknown> = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { isActive: data.status === 'active' }),
    };

    const response = await adminApi.put<unknown>(`/api/v1/admin/subjects/${id}`, payload);
    return normalizeSubject(extractRawSubject(response));
  },
};
