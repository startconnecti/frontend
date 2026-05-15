import { api } from '@/lib/api/client';
import { Session, SessionFilters } from '../types';
import { ListResponse } from '@/lib/api/types';

export const sessionService = {
  async getStudentSessions(filters: SessionFilters): Promise<ListResponse<Session>> {
    const params = { ...filters };
    if (params.status === 'all') delete params.status;
    const response = await api.get<any>('/api/v1/sessions', { params: params as any });

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

  async getSessionById(id: string): Promise<Session> {
    return api.get<Session>(`/api/v1/sessions/${id}`);
  },

  async getTutorSessions(filters: SessionFilters): Promise<ListResponse<Session>> {
    const params = { ...filters };
    if (params.status === 'all') delete params.status;
    const response = await api.get<any>('/api/v1/sessions', { params: params as any });

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

  async getTutorSessionById(id: string): Promise<Session> {
    return api.get<Session>(`/api/v1/sessions/${id}`);
  }
};
