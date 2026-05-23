import { useQuery } from '@tanstack/react-query';
import { payoutService } from '../services/payout-service';

export const TUTOR_PAYOUTS_QUERY_KEY = ['tutor-payouts'];

export function useTutorPayoutsQuery(params?: { limit?: number; offset?: number; status?: string }) {
  return useQuery({
    queryKey: [...TUTOR_PAYOUTS_QUERY_KEY, params],
    queryFn: () => payoutService.getTutorPayouts(params),
  });
}
