import { api } from '@/lib/api/client';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';
import { TutorPayoutSummary } from '../types';

export const payoutService = {
  async getTutorPayoutSummary(): Promise<TutorPayoutSummary> {
    try {
      const data = await api.get<TutorPayoutSummary>('/api/v1/tutor/payouts/summary');
      return data || {
        currency: PLATFORM_CURRENCY,
        availableBalance: 0,
        pendingPayoutAmount: 0,
        processingPayoutAmount: 0,
        completedThisMonthAmount: 0,
        lifetimeEarningsAmount: 0,
      };
    } catch (error) {
      throw error;
    }
  },
};
