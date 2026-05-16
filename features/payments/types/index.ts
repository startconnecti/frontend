import { Payment } from '../types';

export interface PaymentInstruction {
  qrImageUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  amount: number;
  transferNote: string;
  supportMessage?: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
    paymentInstruction: PaymentInstruction;
  };
}
