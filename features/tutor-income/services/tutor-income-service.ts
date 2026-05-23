import { api } from '@/lib/api/client';
import { 
  TutorIncomeSummary, 
  TutorIncomeListResponse, 
  GetTutorIncomeFilters 
} from '../types/index';

export const tutorIncomeService = {
  async getSummary(): Promise<TutorIncomeSummary> {
    try {
      const data = await api.get<TutorIncomeSummary>('/api/v1/tutors/me/income/summary');
      return data || {
        totalEarnings: 0,
        thisMonth: 0,
        pendingAmount: 0,
        availableAmount: 0,
        refundedAmount: 0,
        currency: 'VND',
      };
    } catch (error) {
      throw error;
    }
  },

  async getTransactions(params: GetTutorIncomeFilters): Promise<TutorIncomeListResponse> {
    const queryParams: Record<string, string | number> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status && params.status !== 'all') queryParams.status = params.status;
    if (params.from) queryParams.from = params.from;
    if (params.to) queryParams.to = params.to;

    try {
      const data = await api.get<TutorIncomeListResponse>('/api/v1/tutors/me/income', { params: queryParams });
      return data || { items: [], pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } };
    } catch (error) {
      throw error;
    }
  }
};
