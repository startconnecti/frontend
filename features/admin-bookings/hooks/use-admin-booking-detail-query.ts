import { useQuery } from '@tanstack/react-query';
import { adminBookingsService } from '../services/admin-bookings-service';

export function useAdminBookingDetailQuery(id: string) {
  return useQuery({
    queryKey: ['admin-booking', id],
    queryFn: () => adminBookingsService.getBookingById(id),
    enabled: !!id,
  });
}
