export interface TutorPayoutSummary {
  currency: string;
  availableBalance: number;
  pendingPayoutAmount: number;
  processingPayoutAmount: number;
  completedThisMonthAmount: number;
  lifetimeEarningsAmount: number;
}
