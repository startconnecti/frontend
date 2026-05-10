import { api } from '@/lib/api/client';
import { CreateBookingRequest, Booking } from '../types';

export const bookingService = {
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    return api.post<Booking>('/api/v1/bookings', request);
  }
};
