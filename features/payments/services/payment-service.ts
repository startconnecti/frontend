import { api } from '@/lib/api/client';
import { Payment, PaymentFilters, CreatePaymentRequest } from '../types';

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<Payment[]> {
    return api.get<Payment[]>('/api/v1/payments', { params: filters as any });
  },

  async getPaymentById(id: string): Promise<Payment> {
    return api.get<Payment>(`/api/v1/payments/${id}`);
  },

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    // Handle potential field name alias for backend
    const payload = {
      ...request,
      paymentMethod: request.paymentMethod || request.method
    };
    return api.post<Payment>('/api/v1/payments', payload);
  }
};
