import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminPayoutListItem,
  AdminPayoutListQueryParams,
  AdminPayoutListResponse,
  AdminPayoutStatus,
} from '../types';

interface RawPayoutListItem {
  id?: string;
  payoutId?: string;
  tutorId?: string;
  tutor?: {
    tutorProfileId?: string;
    name?: string;
    email?: string;
  };
  tutorName?: string;
  tutorEmail?: string;
  amount?: number;
  grossAmount?: number;
  netAmount?: number;
  platformCommission?: number;
  paymentMethod?: string;
  currency?: string;
  status?: string;
  note?: string;
  requestedAt?: string;
  processedAt?: string;
  updatedAt?: string;
}

interface RawPayoutListResponse {
  items?: RawPayoutListItem[];
  data?: RawPayoutListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
  total?: number;
  limit?: number;
  offset?: number;
}

function normalizePayoutStatus(status?: string): AdminPayoutStatus {
  if (!status) return 'pending';

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending') return 'pending';
  if (lowerStatus === 'processing' || lowerStatus === 'in_progress') return 'processing';
  if (lowerStatus === 'paid' || lowerStatus === 'completed' || lowerStatus === 'succeeded') return 'paid';
  if (lowerStatus === 'failed') return 'failed';
  if (lowerStatus === 'cancelled') return 'cancelled';

  return 'pending';
}

function normalizePayout(item: RawPayoutListItem): AdminPayoutListItem {
  const amount = item.amount ?? item.netAmount ?? 0;
  const grossAmount = item.grossAmount ?? amount;
  const platformCommission = item.platformCommission ?? (grossAmount - amount);

  return {
    id: item.id ?? item.payoutId ?? '',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? '',
    tutorName: item.tutor?.name ?? item.tutorName ?? '-',
    tutorEmail: item.tutor?.email ?? item.tutorEmail ?? '-',
    amount,
    grossAmount,
    netAmount: amount,
    platformCommission,
    paymentMethod: item.paymentMethod ?? '-',
    currency: item.currency ?? 'USD',
    status: normalizePayoutStatus(item.status),
    note: item.note ?? null,
    requestedAt: item.requestedAt ?? new Date(0).toISOString(),
    processedAt: item.processedAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

function normalizePayoutsResponse(response: RawPayoutListResponse, page: number, limit: number): AdminPayoutListResponse {
  const items = (response.items ?? response.data ?? []).map(normalizePayout);
  const total = response.pagination?.total ?? response.total ?? 0;
  const offset = (page - 1) * limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    page,
    limit,
    offset,
    totalPages,
  };
}

export const adminPayoutsService = {
  async listPayouts(
    params: AdminPayoutListQueryParams
  ): Promise<AdminPayoutListResponse> {
    const { keyword, status, page = 1, limit = 10 } = params;

    const response = await adminApi.get<RawPayoutListResponse>(
      '/admin/payouts',
      {
        params: {
          limit,
          offset: (page - 1) * limit,
          ...(keyword && { keyword }),
          ...(status && { status }),
        },
      }
    );

    return normalizePayoutsResponse(response, page, limit);
  },
};
