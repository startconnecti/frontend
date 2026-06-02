import { api } from '@/lib/api/client';
import { StudentDisputeCreateRequest } from '../types';

export const studentDisputesService = {
  createDispute: async (data: StudentDisputeCreateRequest) => {
    const response = await api.post('/api/v1/disputes', data) as any;
    return response.data;
  },
  cancelDispute: async (disputeId: string) => {
    const response = await api.post(`/api/v1/disputes/${disputeId}/cancel`) as any;
    return response.data;
  },
};
