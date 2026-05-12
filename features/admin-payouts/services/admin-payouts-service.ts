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

function normalizePayout(item: RawPayoutListItem | null | undefined): AdminPayoutListItem {
  if (!item) {
    return {
      id: '',
      tutorId: '',
      tutorName: '-',
      tutorEmail: '-',
      amount: 0,
      grossAmount: 0,
      netAmount: 0,
      platformCommission: 0,
      paymentMethod: '-',
      currency: 'USD',
      status: 'pending',
      note: null,
      requestedAt: new Date(0).toISOString(),
      processedAt: null,
      updatedAt: null,
    };
  }

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

function normalizePayoutsResponse(response: any, page: number, limit: number): AdminPayoutListResponse {
  let rawItems: RawPayoutListItem[] = [];
  let total = 0;
  let paginationData = null;

  if (Array.isArray(response)) {
    rawItems = response;
    total = response.length;
  } else if (response && typeof response === 'object') {
    rawItems = response.items ?? response.data ?? [];
    paginationData = response.pagination;
    total = paginationData?.total ?? response.total ?? rawItems.length;
  }

  const offset = (page - 1) * limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: rawItems.map(normalizePayout),
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

    const response = await adminApi.get<any>(
      '/api/v1/admin/payouts',
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
