import { api } from '@/lib/api/client';
import { Session, SessionFilters } from '../types';

export const sessionService = {
  async getStudentSessions(filters: SessionFilters): Promise<Session[]> {
    return api.get<Session[]>('/api/v1/sessions', { params: filters });
  },

  async getSessionById(id: string): Promise<Session> {
    return api.get<Session>(`/api/v1/sessions/${id}`);
  }
};
