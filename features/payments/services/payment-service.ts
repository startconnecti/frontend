import { api } from '@/lib/api/client';
import { Payment, PaymentDetail, PaymentFilters } from '../types';
import { PaymentResponse } from '../types/index';
import { ListResponse } from '@/lib/api/types';
import { normalizePayment, normalizePaymentDetailResponse } from '../utils/payment-normalizer';

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<{ items: Payment[]; meta: { pagination: { total: number; page: number; limit: number; totalPages: number; } } }> {
    const params = { ...filters };
    if (params.status === 'all') delete params.status;
    const response = await api.get<{ items: any[]; meta: any }>('/api/v1/payments', { params });
    return {
      items: response.items.map(normalizePayment),
      meta: response.meta,
    };
  },

  async getPaymentById(id: string): Promise<PaymentDetail> {
    const raw = await api.get(`/api/v1/payments/${id}`);
    return normalizePaymentDetailResponse(raw);
  },

  async getPaymentDetail(id: string): Promise<PaymentDetail> {
    const raw = await api.get(`/api/v1/payments/${id}`);
    return normalizePaymentDetailResponse(raw);
  },

  async createPayment(bookingId: string): Promise<PaymentResponse> {
    return api.post<PaymentResponse>('/api/v1/payments', { booking_id: bookingId });
  },

  async markPaymentSuccess(id: string): Promise<Payment> {
    return api.patch<Payment>(`/api/v1/payments/${id}/mark-success`);
  }
};
