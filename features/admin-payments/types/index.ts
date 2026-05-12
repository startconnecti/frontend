export type AdminPaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';

export type AdminPaymentMethod = 'card' | 'bank_transfer' | 'e_wallet' | 'other';

export interface AdminPaymentListItem {
  id: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  amount: number;
  currency: string;
  method: AdminPaymentMethod;
  status: AdminPaymentStatus;
  transactionId: string | null;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string | null;
}

export interface AdminPaymentListResponse {
  items: AdminPaymentListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminPaymentListQueryParams {
  keyword?: string;
  status?: AdminPaymentStatus;
  method?: AdminPaymentMethod;
  page?: number;
  limit?: number;
}
