export type AdminPayoutStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled';

export interface AdminPayoutListItem {
  id: string;
  payoutCode: string;
  tutorProfileId: string;
  tutorName: string;
  periodStart: string | null;
  periodEnd: string | null;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: AdminPayoutStatus;
  createdAt: string;
}

export interface AdminPayoutDetail {
  id: string;
  payoutCode: string | null;
  tutorProfileId: string;
  tutorName: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: AdminPayoutStatus;
  approvedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPayoutDetailItem {
  payoutItemId: string;
  sessionId: string;
  paymentId: string | null;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
}

export interface AdminPayoutDetailResponse {
  payout: AdminPayoutDetail;
  items: AdminPayoutDetailItem[];
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
