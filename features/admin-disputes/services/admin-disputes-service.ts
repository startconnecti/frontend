import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminDisputeDetail,
  AdminDisputeDetailResponse,
  AdminDisputeListItem,
  AdminDisputeListQueryParams,
  AdminDisputeListResponse,
  AdminDisputeStatus,
} from '../types';

// ─── Raw response shapes ──────────────────────────────────────────────────────

interface RawDisputeListItem {
  disputeId?: string;
  id?: string;
  disputeCode?: string;
  studentId?: string | null;
  studentName?: string | null;
  tutorProfileId?: string | null;
  tutorName?: string | null;
  sessionId?: string | null;
  status?: string;
  createdAt?: string;
}

interface RawDisputesResponse {
  items?: RawDisputeListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeDisputeStatus(status?: string): AdminDisputeStatus {
  switch (status?.toLowerCase()) {
    case 'pending': return 'pending';
    case 'reviewing': return 'reviewing';
    case 'resolved': return 'resolved';
    case 'rejected': return 'rejected';
    case 'closed': return 'closed';
    default: return 'open';
  }
}

function truncateId(id: string): string {
  if (!id || id.length <= 8) return id || '-';
  return `${id.substring(0, 8)}…`;
}

function normalizeDispute(item: RawDisputeListItem): AdminDisputeListItem {
  const id = item.disputeId ?? item.id ?? '';
  return {
    id,
    disputeCode: item.disputeCode ?? truncateId(id),
    studentId: item.studentId ?? '',
    studentName: item.studentName ?? '-',
    tutorProfileId: item.tutorProfileId ?? '',
    tutorName: item.tutorName ?? '-',
    sessionId: item.sessionId ?? null,
    status: normalizeDisputeStatus(item.status),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminDisputesService = {
  async listDisputes(params: AdminDisputeListQueryParams): Promise<AdminDisputeListResponse> {
    const { keyword, status, page = 1, limit = 10 } = params;

    const response = await adminApi.get<RawDisputesResponse>('/api/v1/admin/disputes', {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(keyword && { keyword }),
        ...(status && { status }),
      },
    });

    const rawItems: RawDisputeListItem[] = response?.items ?? [];
    const total = response?.pagination?.total ?? rawItems.length;

    return {
      items: rawItems.filter(Boolean).map(normalizeDispute),
      total,
      page,
      limit,
      offset: (page - 1) * limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  async getDisputeDetail(disputeId: string): Promise<AdminDisputeDetailResponse> {
    const response = await adminApi.get<{ dispute: AdminDisputeDetail }>(
      `/api/v1/admin/disputes/${disputeId}`,
    );
    return response;
  },

  async markReviewing(disputeId: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/disputes/${disputeId}/mark-reviewing`, {
      note: note ?? null,
    });
  },

  async resolveDispute(
    disputeId: string,
    resolutionType: string,
    resolutionNote?: string,
  ): Promise<void> {
    await adminApi.post(`/api/v1/admin/disputes/${disputeId}/resolve`, {
      resolutionType,
      resolutionNote: resolutionNote ?? null,
    });
  },

  async rejectDispute(disputeId: string, reason?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/disputes/${disputeId}/reject`, {
      reason: reason ?? null,
    });
  },

  async closeDispute(disputeId: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/disputes/${disputeId}/close`, {
      note: note ?? null,
    });
  },
};
