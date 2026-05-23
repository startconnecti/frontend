import { api } from '@/lib/api/client';
import { TutorPayoutSummary } from '../types';

export const payoutService = {
  async getTutorPayoutSummary(): Promise<TutorPayoutSummary> {
    const response = await api.get<{ data: TutorPayoutSummary }>('/api/v1/tutor/payouts/summary');
    return response.data;
  },
};
