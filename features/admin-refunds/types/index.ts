export type AdminRefundStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'processed' | 'failed' | 'cancelled';

export interface AdminRefundListItem {
  id: string;
  refundCode: string;
  studentId: string;
  studentName: string;
  bookingId: string;
  bookingCode: string;
  paymentId: string;
  amount: number | null;
  status: AdminRefundStatus;
  createdAt: string;
}

export interface AdminRefundDetail {
  id: string;
  refundCode: string;
  student: {
    id: string;
    fullName: string;
  };
  booking: {
    id: string;
    bookingCode: string;
  };
  payment: {
    id: string;
    paymentCode: string;
  };
  amount: number | null;
  reason: string | null;
  status: AdminRefundStatus;
  approvedAt: string | null;
  rejectedAt: string | null;
  processingAt: string | null;
  refundedAt: string | null;
  failedAt: string | null;
  approvalNote: string | null;
  rejectReason: string | null;
  processingNote: string | null;
  refundNote: string | null;
  failedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRefundListResponse {
  items: AdminRefundListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminRefundListQueryParams {
  keyword?: string;
  status?: AdminRefundStatus;
  reason?: string;
  page?: number;
  limit?: number;
}
