import { api } from '@/lib/api/client';
import { 
  TutorIncomeSummary, 
  TutorIncomeListResponse, 
  GetTutorIncomeFilters 
} from '../types/index';

export const tutorIncomeService = {
  async getSummary(): Promise<TutorIncomeSummary> {
    const response = await api.get<{ data: TutorIncomeSummary }>('/api/v1/tutors/me/income/summary');
    return response.data;
  },

  async getTransactions(params: GetTutorIncomeFilters): Promise<TutorIncomeListResponse> {
    const queryParams: Record<string, string | number> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status && params.status !== 'all') queryParams.status = params.status;
    if (params.from) queryParams.from = params.from;
    if (params.to) queryParams.to = params.to;

    const response = await api.get<{ data: TutorIncomeListResponse }>('/api/v1/tutors/me/income', { params: queryParams });
    return response.data;
  }
};
