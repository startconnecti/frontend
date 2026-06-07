import { api } from '@/lib/api/client';
import { TutorAvailability, UpdateAvailabilityRequest, CreateAvailabilityRequest } from '../types';

export const tutorAvailabilityService = {
  async getTutorAvailability(): Promise<TutorAvailability> {
    const response = await api.get<{ items: any[] }>('/api/v1/tutor/weekly-availability');
    const items = response.items || [];
    return {
      slots: items.map(item => ({
        id: item.id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        isActive: item.isActive,
      })),
      timezone: items.length > 0 ? items[0].timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },

  async createTutorAvailability(request: CreateAvailabilityRequest): Promise<any> {
    return api.post<any>('/api/v1/tutor/weekly-availability', request);
  },

  async deleteTutorAvailability(id: string): Promise<any> {
    return api.delete<any>(`/api/v1/tutor/weekly-availability/${id}`);
  }
};
