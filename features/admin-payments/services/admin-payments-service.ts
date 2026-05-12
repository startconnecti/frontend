import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminPaymentListItem,
  AdminPaymentListQueryParams,
  AdminPaymentListResponse,
  AdminPaymentStatus,
  AdminPaymentMethod,
} from '../types';

interface RawPaymentListItem {
  id?: string;
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
  tutorId?: string;
  tutor?: {
    tutorProfileId?: string;
    name?: string;
    email?: string;
  };
  tutorName?: string;
  tutorEmail?: string;
  amount?: number;
  totalAmount?: number;
  currency?: string;
  method?: string;
  paymentMethod?: string;
  status?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  createdAt?: string;
  paidAt?: string;
  succeededAt?: string;
  updatedAt?: string;
}

interface RawPaymentListResponse {
  items?: RawPaymentListItem[];
  data?: RawPaymentListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
  total?: number;
  limit?: number;
  offset?: number;
}

function normalizePaymentStatus(status?: string): AdminPaymentStatus {
  if (!status) return 'pending';

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending') return 'pending';
  if (lowerStatus === 'processing' || lowerStatus === 'in_progress') return 'processing';
  if (lowerStatus === 'succeeded' || lowerStatus === 'completed' || lowerStatus === 'paid')
    return 'succeeded';
  if (lowerStatus === 'failed') return 'failed';
  if (lowerStatus === 'cancelled') return 'cancelled';
  if (lowerStatus === 'refunded') return 'refunded';

  return 'pending';
}

function normalizePaymentMethod(method?: string): AdminPaymentMethod {
  if (!method) return 'card';

  const lowerMethod = method.toLowerCase();
  if (lowerMethod === 'card' || lowerMethod === 'credit_card' || lowerMethod === 'debit_card')
    return 'card';
  if (lowerMethod === 'bank_transfer' || lowerMethod === 'bank') return 'bank_transfer';
  if (lowerMethod === 'e_wallet' || lowerMethod === 'wallet') return 'e_wallet';

  return 'other';
}

function normalizePayment(item: RawPaymentListItem | null | undefined): AdminPaymentListItem {
  if (!item) {
    return {
      id: '',
      bookingId: '',
      studentId: '',
      studentName: '-',
      studentEmail: '-',
      tutorId: '',
      tutorName: '-',
      tutorEmail: '-',
      amount: 0,
      currency: 'USD',
      method: 'card',
      status: 'pending',
      transactionId: null,
      createdAt: new Date(0).toISOString(),
      paidAt: null,
      updatedAt: null,
    };
  }

  return {
    id: item.id ?? item.paymentId ?? '',
    bookingId: item.bookingId ?? '',
    studentId: item.studentId ?? item.student?.userId ?? '',
    studentName: item.student?.name ?? item.studentName ?? '-',
    studentEmail: item.student?.email ?? item.studentEmail ?? '-',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? '',
    tutorName: item.tutor?.name ?? item.tutorName ?? '-',
    tutorEmail: item.tutor?.email ?? item.tutorEmail ?? '-',
    amount: item.amount ?? item.totalAmount ?? 0,
    currency: item.currency ?? 'USD',
    method: normalizePaymentMethod(item.method ?? item.paymentMethod),
    status: normalizePaymentStatus(item.status),
    transactionId: item.transactionId ?? item.gatewayTransactionId ?? null,
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    paidAt: item.paidAt ?? item.succeededAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

export async function getAdminPayments(
  params: AdminPaymentListQueryParams = {}
): Promise<AdminPaymentListResponse> {
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
  if (params.method) {
    queryParams.method = params.method;
  }

  const response = await adminApi.get<any>('/api/v1/admin/payments', {
    params: queryParams,
  });

  let rawItems: RawPaymentListItem[] = [];
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
    items: rawItems.map(normalizePayment),
    total,
    page,
    limit: responseLimit,
    offset: responseOffset,
    totalPages,
  };
}
