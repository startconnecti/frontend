import { api } from '@/lib/api/client';
import { Payment, PaymentFilters } from '../types';
import { PaymentResponse } from '../types/index';
import { ListResponse } from '@/lib/api/types';

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<{ items: Payment[]; meta: { pagination: { total: number; page: number; limit: number; totalPages: number; } } }> {
    const params = { ...filters };
    if (params.status === 'all') delete params.status;
    return api.get('/api/v1/payments', { params });
  },

  async getPaymentById(id: string): Promise<Payment> {
    return api.get<Payment>(`/api/v1/payments/${id}`);
  },

  async createPayment(bookingId: string): Promise<PaymentResponse> {
    return api.post<PaymentResponse>('/api/v1/payments', { booking_id: bookingId });
  }
};
