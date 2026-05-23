import { useQuery } from '@tanstack/react-query';
import { tutorIncomeService } from '../services/tutor-income-service';

export const TUTOR_INCOME_SUMMARY_QUERY_KEY = ['tutor-income-summary'];

export function useTutorIncomeSummaryQuery() {
  return useQuery({
    queryKey: TUTOR_INCOME_SUMMARY_QUERY_KEY,
    queryFn: () => tutorIncomeService.getSummary(),
  });
}
