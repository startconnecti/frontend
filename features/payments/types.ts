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
  id: string;
  paymentCode: string;
  bookingId: string;
  sessionId?: string;
  tutor: PaymentTutor;
  subject: string;
  sessionTime?: string;
  amountTotal: number;
  platformFee: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  transferReference?: string;
  transferInstructions?: string;
  paymentUrl?: string;
  proofFileUrl?: string;
  refundSummary?: RefundSummary;
}

export interface CreatePaymentRequest {
  bookingId: string;
  method: PaymentMethod;
  paymentMethod?: PaymentMethod;
}

export interface PaymentFilters {
  status?: PaymentStatus | 'all';
}
