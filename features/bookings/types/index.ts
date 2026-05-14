export interface CreateBookingRequest {
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  availabilityId?: string;
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  paymentId?: string;
  createdAt: string;
}
