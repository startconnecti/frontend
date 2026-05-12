export type AdminRefundStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'processed' | 'failed' | 'cancelled';

export interface AdminRefundListItem {
  id: string;
  paymentId: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: string;
  status: AdminRefundStatus;
  reason: string;
  note: string | null;
  requestedAt: string;
  processedAt: string | null;
  updatedAt: string | null;
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
