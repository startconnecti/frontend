import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminRefundListItem,
  AdminRefundDetail,
  AdminRefundListQueryParams,
  AdminRefundListResponse,
  AdminRefundStatus,
} from '../types';

function normalizeRefundStatus(status?: string): AdminRefundStatus {
  if (!status) return 'pending';

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending') return 'pending';
  if (lowerStatus === 'approved') return 'approved';
  if (lowerStatus === 'rejected') return 'rejected';
  if (lowerStatus === 'processing' || lowerStatus === 'in_progress') return 'processing';
  if (lowerStatus === 'processed' || lowerStatus === 'refunded' || lowerStatus === 'completed') return 'refunded' as AdminRefundStatus;
  if (lowerStatus === 'failed') return 'failed';
  if (lowerStatus === 'cancelled') return 'cancelled';

  return 'pending';
}

function normalizeRefund(item: any): AdminRefundListItem {
  if (!item) {
    return {
      id: '',
      refundCode: '',
      studentId: '',
      studentName: '-',
      bookingId: '',
      bookingCode: '-',
      paymentId: '',
      amount: 0,
      status: 'pending',
      createdAt: new Date(0).toISOString(),
    };
  }

  return {
    id: item.refundId ?? item.id ?? '',
    refundCode: item.refundCode ?? '',
    studentId: item.student?.id ?? item.studentId ?? '',
    studentName: item.student?.fullName ?? item.studentName ?? '-',
    bookingId: item.booking?.id ?? item.bookingId ?? '',
    bookingCode: item.booking?.bookingCode ?? '-',
    paymentId: item.payment?.id ?? item.paymentId ?? '',
    amount: item.amount ?? item.refundAmount ?? 0,
    status: normalizeRefundStatus(item.status),
    createdAt: item.createdAt ?? item.requestedAt ?? new Date(0).toISOString(),
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

  let rawItems: any[] = [];
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

export async function getAdminRefundDetail(id: string): Promise<AdminRefundDetail> {
  const response = await adminApi.get<any>(`/api/v1/admin/refunds/${id}`);
  const refund = response?.refund || response;
  
  return {
    id: refund.id ?? '',
    refundCode: refund.refundCode ?? '',
    student: {
      id: refund.student?.id ?? '',
      fullName: refund.student?.fullName ?? 'Unknown student',
    },
    booking: {
      id: refund.booking?.id ?? '',
      bookingCode: refund.booking?.bookingCode ?? 'Unknown booking',
    },
    payment: {
      id: refund.payment?.id ?? '',
      paymentCode: refund.payment?.paymentCode ?? 'N/A',
    },
    amount: refund.amount ?? null,
    reason: refund.reason ?? null,
    status: normalizeRefundStatus(refund.status),
    approvedAt: refund.approvedAt ?? null,
    rejectedAt: refund.rejectedAt ?? null,
    processingAt: refund.processingAt ?? null,
    refundedAt: refund.refundedAt ?? null,
    failedAt: refund.failedAt ?? null,
    approvalNote: refund.approvalNote ?? null,
    rejectReason: refund.rejectReason ?? null,
    processingNote: refund.processingNote ?? null,
    refundNote: refund.refundNote ?? null,
    failedReason: refund.failedReason ?? null,
    createdAt: refund.createdAt ?? new Date(0).toISOString(),
    updatedAt: refund.updatedAt ?? new Date(0).toISOString(),
  };
}

export async function approveAdminRefund(id: string, note?: string): Promise<{ message: string }> {
  return adminApi.post(`/api/v1/admin/refunds/${id}/approve`, { note });
}

export async function rejectAdminRefund(id: string, reason: string): Promise<{ message: string }> {
  return adminApi.post(`/api/v1/admin/refunds/${id}/reject`, { reason });
}
