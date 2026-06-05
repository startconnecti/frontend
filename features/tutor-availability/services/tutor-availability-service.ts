import { api } from '@/lib/api/client';
import { TutorAvailability, UpdateAvailabilityRequest, CreateAvailabilityRequest } from '../types';

export const tutorAvailabilityService = {
  async getTutorAvailability(): Promise<TutorAvailability> {
    // Keep legacy path if mock exists, or adapt to real
    return api.get<TutorAvailability>('/api/v1/tutor/weekly-availability');
  },

  async createTutorAvailability(request: CreateAvailabilityRequest): Promise<any> {
    return api.post<any>('/api/v1/tutor/weekly-availability', request);
  },

  async updateTutorAvailability(request: UpdateAvailabilityRequest): Promise<TutorAvailability> {
    // Legacy method used by availability page (currently non-functional backend route)
    return api.put<TutorAvailability>('/api/v1/tutors/availability', request);
  }
};
