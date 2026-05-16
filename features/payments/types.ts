export type PaymentStatus = 
  | 'pending' 
  | 'waiting_admin_confirmation' 
  | 'confirmed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'manual_bank_transfer' | 'momo' | 'vnpay';

export interface PaymentTutor {
  id: string;
  fullName: string;
}

export interface RefundSummary {
  amount: number;
  reason: string;
  refundedAt: string;
}

export interface Payment {
  paymentId: string;
  paymentCode: string;
  bookingId: string;
  tutorProfileId?: string;
  tutorName?: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  confirmedAt?: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  method: PaymentMethod;
  paymentMethod?: PaymentMethod;
}

export interface PaymentFilters {
  status?: PaymentStatus | 'all';
  limit?: number;
  page?: number;
}
