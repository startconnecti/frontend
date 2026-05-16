export type BookingStatus = 'pending_payment' | 'payment_processing' | 'confirmed' | 'expired' | 'cancelled' | 'completed';

export interface Booking {
  bookingId: string;
  bookingCode: string;
  tutorProfileId: string;
  studentId: string;
  subject: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: BookingStatus;
  amount: number;
  paymentId?: string;
  createdAt: string; // ISO string
  expiresAt?: string; // ISO string (for pending_payment hold window)
}

export interface BookingPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface BookingListResponse {
  items: Booking[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetBookingsParams {
  limit?: number;
  page?: number;
  status?: BookingStatus | 'all';
}

export interface CreateBookingRequest {
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  availabilityId?: string;
}

export interface CancelBookingPayload {
  cancellation_reason?: string;
}
