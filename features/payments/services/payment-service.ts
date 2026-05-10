import { api } from '@/lib/api/client';
import { Payment, PaymentFilters } from '../types';

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<Payment[]> {
    return api.get<Payment[]>('/api/v1/payments', { params: filters });
  },

  async getPaymentById(id: string): Promise<Payment> {
    return api.get<Payment>(`/api/v1/payments/${id}`);
  }
};
