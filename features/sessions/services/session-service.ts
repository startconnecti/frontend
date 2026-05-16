import { api } from '@/lib/api/client';
import { SessionListResponse, GetSessionsParams } from '../types/index';

export const sessionService = {
  async getSessions(params: GetSessionsParams): Promise<SessionListResponse> {
    const queryParams: Record<string, string | number> = {};
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset) queryParams.offset = params.offset;
    if (params.status && params.status !== 'all') queryParams.status = params.status;
    
    return api.get<SessionListResponse>('/api/v1/sessions', { params: queryParams });
  },

  async cancelSession(sessionId: string, payload: { cancellation_reason?: string }): Promise<void> {
    return api.post<void>(`/api/v1/sessions/${sessionId}/cancel`, payload);
  }
};
