import { useQuery } from '@tanstack/react-query';
import { adminBookingsService } from '../services/admin-bookings-service';
import { AdminBookingsQueryParams } from '../types';

export function useAdminBookingsQuery(params: AdminBookingsQueryParams) {
  return useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: () => adminBookingsService.getBookings(params),
  });
}
