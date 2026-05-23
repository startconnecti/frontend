export interface TutorIncomeSummary {
  totalEarnings: number;
  thisMonth: number;
  pendingAmount: number;
  availableAmount: number;
  refundedAmount: number;
  currency: string;
}

export type TutorIncomeStatus = 'pending' | 'available' | 'refunded';

export interface TutorIncomeTransaction {
  earningId: string;
  sessionId: string | null;
  bookingId: string;
  paymentId: string;
  studentName: string;
  subjectName: string;
  sessionStartTime: string;
  sessionEndTime: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: TutorIncomeStatus;
  createdAt: string;
}

export interface TutorIncomeListResponse {
  items: TutorIncomeTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface GetTutorIncomeFilters {
  page?: number;
  limit?: number;
  status?: TutorIncomeStatus | 'all';
  from?: string; // ISO date string
  to?: string; // ISO date string
}
