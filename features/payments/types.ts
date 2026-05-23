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
  tutorProfileId?: string;
  tutorName?: string;
  subject?: string;
  amount: number;
  amountTotal?: number;
  platformFee?: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string | null;

  transferInstructions?: string | null;
  transferReference?: string | null;
  paymentUrl?: string | null;
  proofFileUrl?: string | null;
  refundSummary?: RefundSummary | null;
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

export interface SessionSummary {
  id: string;
  status: string;
  meetingStatus?: string | null;
  meetingUrl?: string | null;
  scheduledStartTime: string;
  scheduledEndTime: string;
}

export interface PaymentDetail {
  payment: Payment;
  bookingSummary?: {
    bookingId: string;
    bookingCode: string;
    subjectName: string;
    startTime: string;
    endTime: string;
  } | null;
  tutorSummary?: {
    tutorProfileId: string;
    tutorName: string;
  } | null;
  session?: SessionSummary | null;
  paymentInstruction?: any | null;
}

export * from './types/index';
