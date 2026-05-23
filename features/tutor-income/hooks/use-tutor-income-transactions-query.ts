import { useQuery } from '@tanstack/react-query';
import { tutorIncomeService } from '../services/tutor-income-service';
import { GetTutorIncomeFilters } from '../types/index';

export const TUTOR_INCOME_TRANSACTIONS_QUERY_KEY = (filters: GetTutorIncomeFilters) => ['tutor-income-transactions', filters];

export function useTutorIncomeTransactionsQuery(filters: GetTutorIncomeFilters) {
  return useQuery({
    queryKey: TUTOR_INCOME_TRANSACTIONS_QUERY_KEY(filters),
    queryFn: () => tutorIncomeService.getTransactions(filters),
  });
}
