export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
}
