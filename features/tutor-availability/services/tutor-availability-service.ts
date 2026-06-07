import { api } from '@/lib/api/client';
import { TutorAvailability, UpdateAvailabilityRequest, CreateAvailabilityRequest } from '../types';

export const tutorAvailabilityService = {
  async getTutorAvailability(): Promise<TutorAvailability> {
    const response = await api.get<any>('/api/v1/tutor/weekly-availability');
    console.log('[DEBUG] Raw API Response:', response);
    
    // Extract items safely from any possible wrapper (e.g. if api.get didn't unwrap data, or it's double-wrapped)
    let items: any[] = [];
    if (Array.isArray(response)) {
      items = response;
    } else if (response?.items && Array.isArray(response.items)) {
      items = response.items;
    } else if (response?.data?.items && Array.isArray(response.data.items)) {
      items = response.data.items;
    } else if (response?.data && Array.isArray(response.data)) {
      items = response.data;
    }
    
    console.log('[DEBUG] Extracted Items:', items);
    
    const mapped = {
      slots: items.map((item: any) => ({
        id: item.id,
        dayOfWeek: item.dayOfWeek || item.day_of_week,
        startTime: item.startTime || item.start_time,
        endTime: item.endTime || item.end_time,
        isActive: item.isActive ?? true,
      })),
      timezone: items.length > 0 ? (items[0].timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) : Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    
    console.log('[DEBUG] Normalized Slots:', mapped.slots);
    return mapped;
  },

  async createTutorAvailability(request: CreateAvailabilityRequest): Promise<any> {
    return api.post<any>('/api/v1/tutor/weekly-availability', request);
  },

  async deleteTutorAvailability(id: string): Promise<any> {
    return api.delete<any>(`/api/v1/tutor/weekly-availability/${id}`);
  }
};
