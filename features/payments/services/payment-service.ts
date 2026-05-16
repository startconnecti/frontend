import { api } from '@/lib/api/client';
import { Payment, PaymentFilters } from '../types';
import { PaymentResponse } from '../types/index';
import { ListResponse } from '@/lib/api/types';

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<ListResponse<Payment>> {
    const params = { ...filters };
    if (params.status === 'all') delete params.status;
    const response = await api.get<any>('/api/v1/payments', { params: params as any });
    
    if (Array.isArray(response)) {
      return { items: response, total: response.length, limit: response.length, offset: 0 };
    }
    
    return {
      items: response?.items ?? response?.data ?? [],
      total: response?.total ?? 0,
      limit: response?.limit ?? 10,
      offset: response?.offset ?? 0
    };
  },

  async getPaymentById(id: string): Promise<Payment> {
    return api.get<Payment>(`/api/v1/payments/${id}`);
  },

  async createPayment(bookingId: string): Promise<PaymentResponse> {
    return api.post<PaymentResponse>('/api/v1/payments', { booking_id: bookingId });
  }
};
