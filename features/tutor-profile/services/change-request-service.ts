import { api } from '@/lib/api/client';
import { 
  TutorProfileChangeRequest, 
  GetChangeRequestsParams, 
  ChangeRequestsListResponse 
} from '../types';

function normalizeChangeRequest(data: Record<string, any>): TutorProfileChangeRequest {
  const req = data.request || data.changeRequest || data;
  return {
    id: req.requestId || req.id,
    tutorProfileId: req.tutorProfileId || req.tutorId,
    status: req.status,
    changePayload: req.changePayload || req.change_payload,
    requestNote: req.requestNote || req.request_note,
    adminNote: req.adminNote || req.admin_note,
    createdAt: req.createdAt,
    updatedAt: req.updatedAt,
  };
}

export const changeRequestService = {
  async getChangeRequests(params?: GetChangeRequestsParams): Promise<ChangeRequestsListResponse> {
    const response = await api.get<any>('/api/v1/tutor/profile-change-requests', { params: params as any });
    return {
      items: (response.items || []).map(normalizeChangeRequest),
      pagination: response.pagination || { limit: 10, offset: 0, total: 0 },
    };
  },

  async getChangeRequest(id: string): Promise<TutorProfileChangeRequest> {
    const response = await api.get<any>(`/api/v1/tutor/profile-change-requests/${id}`);
    return normalizeChangeRequest(response);
  },

  async createChangeRequest(payload: FormData): Promise<TutorProfileChangeRequest> {
    const response = await api.post<any>('/api/v1/tutor/profile-change-requests', payload);
    return normalizeChangeRequest(response);
  },



  async deleteChangeRequest(id: string): Promise<void> {
    await api.delete(`/api/v1/tutor/profile-change-requests/${id}`);
  }
};
