'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking-service';
import { GetBookingsParams } from '../types';

export function useStudentBookingsQuery(params: GetBookingsParams) {
  return useQuery({
    queryKey: ['student-bookings', params.status, params.limit, params.page],
    queryFn: () => bookingService.getBookings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
