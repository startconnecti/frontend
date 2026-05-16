import { api } from '@/lib/api/client';
import { CreateBookingRequest, Booking, BookingListResponse, GetBookingsParams, CancelBookingPayload } from '../types';

export const bookingService = {
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    return api.post<Booking>('/api/v1/bookings', request);
  },
  
  async getBookings(params: GetBookingsParams): Promise<BookingListResponse> {
    const queryParams: Record<string, string | number> = {};
    if (params.limit) queryParams.limit = params.limit;
    if (params.page) queryParams.page = params.page;
    if (params.status && params.status !== 'all') queryParams.status = params.status;
    
    return api.get<BookingListResponse>('/api/v1/bookings', { params: queryParams });
  },

  async cancelBooking(bookingId: string, payload: CancelBookingPayload): Promise<void> {
    return api.post<void>(`/api/v1/bookings/${bookingId}/cancel`, payload);
  }
};
