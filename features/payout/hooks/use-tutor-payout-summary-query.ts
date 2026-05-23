import { useQuery } from '@tanstack/react-query';
import { payoutService } from '../services/payout-service';

export const TUTOR_PAYOUT_SUMMARY_QUERY_KEY = ['tutor-payout-summary'];

export function useTutorPayoutSummaryQuery() {
  return useQuery({
    queryKey: TUTOR_PAYOUT_SUMMARY_QUERY_KEY,
    queryFn: () => payoutService.getTutorPayoutSummary(),
  });
}
