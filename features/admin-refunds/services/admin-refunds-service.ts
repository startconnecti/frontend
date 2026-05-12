import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminRefundListItem,
  AdminRefundListQueryParams,
  AdminRefundListResponse,
  AdminRefundStatus,
} from '../types';

interface RawRefundListItem {
  id?: string;
  refundId?: string;
  paymentId?: string;
  bookingId?: string;
  studentId?: string;
  student?: {
    userId?: string;
    name?: string;
    email?: string;
  };
  studentName?: string;
  studentEmail?: string;
  amount?: number;
  refundAmount?: number;
  currency?: string;
  status?: string;
  reason?: string;
  note?: string;
  requestedAt?: string;
  createdAt?: string;
  processedAt?: string;
  updatedAt?: string;
}

interface RawRefundListResponse {
  items?: RawRefundListItem[];
  data?: RawRefundListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
  total?: number;
  limit?: number;
  offset?: number;
}

function normalizeRefundStatus(status?: string): AdminRefundStatus {
  if (!status) return 'pending';

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending') return 'pending';
  if (lowerStatus === 'approved') return 'approved';
  if (lowerStatus === 'rejected') return 'rejected';
  if (lowerStatus === 'processing' || lowerStatus === 'in_progress') return 'processing';
  if (lowerStatus === 'processed' || lowerStatus === 'completed') return 'processed';
  if (lowerStatus === 'failed') return 'failed';
  if (lowerStatus === 'cancelled') return 'cancelled';

  return 'pending';
}

function normalizeRefund(item: RawRefundListItem | null | undefined): AdminRefundListItem {
  if (!item) {
    return {
      id: '',
      paymentId: '',
      bookingId: '',
      studentId: '',
      studentName: '-',
      studentEmail: '-',
      amount: 0,
      currency: 'USD',
      status: 'pending',
      reason: '-',
      note: null,
      requestedAt: new Date(0).toISOString(),
      processedAt: null,
      updatedAt: null,
    };
  }

  return {
    id: item.id ?? item.refundId ?? '',
    paymentId: item.paymentId ?? '',
    bookingId: item.bookingId ?? '',
    studentId: item.studentId ?? item.student?.userId ?? '',
    studentName: item.student?.name ?? item.studentName ?? '-',
    studentEmail: item.student?.email ?? item.studentEmail ?? '-',
    amount: item.amount ?? item.refundAmount ?? 0,
    currency: item.currency ?? 'USD',
    status: normalizeRefundStatus(item.status),
    reason: item.reason ?? '-',
    note: item.note ?? null,
    requestedAt: item.requestedAt ?? item.createdAt ?? new Date(0).toISOString(),
    processedAt: item.processedAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

export async function getAdminRefunds(
  params: AdminRefundListQueryParams = {}
): Promise<AdminRefundListResponse> {
  const limit = params.limit ?? 10;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;

  const queryParams: Record<string, string | number> = {
    limit,
    offset,
  };

  if (params.keyword) {
    queryParams.keyword = params.keyword;
  }
  if (params.status) {
    queryParams.status = params.status;
  }
  if (params.reason) {
    queryParams.reason = params.reason;
  }

  const response = await adminApi.get<any>('/api/v1/admin/refunds', {
    params: queryParams,
  });

  let rawItems: RawRefundListItem[] = [];
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

  const responseLimit = paginationData?.limit ?? limit;
  const responseOffset = paginationData?.offset ?? offset;
  const totalPages = Math.max(1, Math.ceil(total / responseLimit));

  return {
    items: rawItems.map(normalizeRefund),
    total,
    page,
    limit: responseLimit,
    offset: responseOffset,
    totalPages,
  };
}
