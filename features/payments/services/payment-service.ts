import { Payment, PaymentFilters } from '../types';
import { MOCK_PAYMENTS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getStudentPayments(filters: PaymentFilters): Promise<Payment[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    let filtered = [...MOCK_PAYMENTS];
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    return MOCK_PAYMENTS.find(p => p.id === id) || null;
  }
};
