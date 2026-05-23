export interface TutorPayoutSummary {
  currency: string;
  availableBalance: number;
  pendingPayoutAmount: number;
  processingPayoutAmount: number;
  completedThisMonthAmount: number;
  lifetimeEarningsAmount: number;
}

export interface TutorPayout {
  payoutId: string;
  payoutCode: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: string;
  paidAt: string | null;
  method?: string; // Not returned currently, but useful for future
}

export interface TutorPayoutListResponse {
  items: TutorPayout[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
