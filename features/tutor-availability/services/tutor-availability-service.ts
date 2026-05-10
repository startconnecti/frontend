import { api } from '@/lib/api/client';
import { TutorAvailability, UpdateAvailabilityRequest } from '../types';

export const tutorAvailabilityService = {
  async getTutorAvailability(): Promise<TutorAvailability> {
    return api.get<TutorAvailability>('/api/v1/tutors/availability');
  },

  async updateTutorAvailability(request: UpdateAvailabilityRequest): Promise<TutorAvailability> {
    return api.put<TutorAvailability>('/api/v1/tutors/availability', request);
  }
};
