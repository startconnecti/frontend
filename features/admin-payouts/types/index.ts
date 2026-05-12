export type AdminPayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';

export interface AdminPayoutListItem {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  amount: number;
  grossAmount: number;
  netAmount: number;
  platformCommission: number;
  paymentMethod: string;
  currency: string;
  status: AdminPayoutStatus;
  note: string | null;
  requestedAt: string;
  processedAt: string | null;
  updatedAt: string | null;
}

export interface AdminPayoutListResponse {
  items: AdminPayoutListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminPayoutListQueryParams {
  keyword?: string;
  status?: AdminPayoutStatus;
  page?: number;
  limit?: number;
}
