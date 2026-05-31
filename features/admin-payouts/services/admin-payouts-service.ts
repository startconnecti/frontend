import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminPayoutDetailResponse,
  AdminPayoutListItem,
  AdminPayoutListQueryParams,
  AdminPayoutListResponse,
  AdminPayoutStatus,
} from '../types';

// ─── Raw response shapes from backend ────────────────────────────────────────

interface RawPayoutListItem {
  payoutId?: string;
  id?: string;
  payoutCode?: string;
  tutorProfileId?: string;
  tutorId?: string;
  tutorName?: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  grossAmount?: number | null;
  commissionAmount?: number | null;
  netAmount?: number | null;
  status?: string;
  createdAt?: string;
}

interface RawPayoutsResponse {
  items?: RawPayoutListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizePayoutStatus(status?: string): AdminPayoutStatus {
  switch (status?.toLowerCase()) {
    case 'approved': return 'approved';
    case 'processing': return 'processing';
    case 'paid': return 'paid';
    case 'failed': return 'failed';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}

function safeNumber(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  return value;
}

function normalizePayout(item: RawPayoutListItem): AdminPayoutListItem {
  const id = item.payoutId ?? item.id ?? '';
  return {
    id,
    payoutCode: item.payoutCode ?? id.substring(0, 8).toUpperCase(),
    tutorProfileId: item.tutorProfileId ?? item.tutorId ?? '',
    tutorName: item.tutorName ?? '-',
    periodStart: item.periodStart ?? null,
    periodEnd: item.periodEnd ?? null,
    grossAmount: safeNumber(item.grossAmount),
    commissionAmount: safeNumber(item.commissionAmount),
    netAmount: safeNumber(item.netAmount),
    status: normalizePayoutStatus(item.status),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminPayoutsService = {
  async listPayouts(params: AdminPayoutListQueryParams): Promise<AdminPayoutListResponse> {
    const { keyword, status, page = 1, limit = 10 } = params;

    const response = await adminApi.get<RawPayoutsResponse>('/api/v1/admin/payouts', {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(keyword && { keyword }),
        ...(status && { status }),
      },
    });

    const rawItems: RawPayoutListItem[] = response?.items ?? [];
    const total = response?.pagination?.total ?? rawItems.length;

    return {
      items: rawItems.filter(Boolean).map(normalizePayout),
      total,
      page,
      limit,
      offset: (page - 1) * limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  async getPayoutDetail(payoutId: string): Promise<AdminPayoutDetailResponse> {
    return adminApi.get<AdminPayoutDetailResponse>(`/api/v1/admin/payouts/${payoutId}`);
  },

  async approvePayout(payoutId: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/payouts/${payoutId}/approve`, { note: note ?? null });
  },

  async markPayoutProcessing(payoutId: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/payouts/${payoutId}/mark-processing`, { note: note ?? null });
  },

  async markPayoutPaid(payoutId: string, note?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/payouts/${payoutId}/mark-paid`, { note: note ?? null });
  },

  async cancelPayout(payoutId: string, reason?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/payouts/${payoutId}/cancel`, { reason: reason ?? null });
  },
};
