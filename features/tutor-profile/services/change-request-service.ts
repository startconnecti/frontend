import { api } from '@/lib/api/client';
import { 
  TutorProfileChangeRequest, 
  GetChangeRequestsParams, 
  ChangeRequestsListResponse 
} from '../types';

import { TutorProfileChangePayload } from '../types';

function normalizeChangePayload(raw: any): TutorProfileChangePayload {
  if (!raw || typeof raw !== 'object') {
    return { profile: {}, subject_ids: [], certifications: [] };
  }

  // Safely unwrap potentially nested payload
  const step1 = raw.changePayload || raw.payload || raw;
  const payload = step1.changePayload || step1.payload || step1;

  return {
    profile: payload.profile ?? {},
    subject_ids: payload.subject_ids ?? payload.subjects ?? [],
    certifications: payload.certifications ?? [],
  };
}

function normalizeChangeRequest(data: Record<string, any>): TutorProfileChangeRequest {
  const req = data.request || data.changeRequest || data;
  return {
    id: req.requestId || req.id,
    tutorProfileId: req.tutorProfileId || req.tutorId,
    status: req.status,
    changePayload: normalizeChangePayload(req.changePayload || req.change_payload),
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

  async updateChangeRequest(id: string, payload: FormData): Promise<TutorProfileChangeRequest> {
    const response = await api.put<any>(`/api/v1/tutor/profile-change-requests/${id}`, payload);
    return normalizeChangeRequest(response);
  },



  async deleteChangeRequest(id: string): Promise<void> {
    await api.delete(`/api/v1/tutor/profile-change-requests/${id}`);
  }
};
