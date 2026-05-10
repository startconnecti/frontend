import { api } from '@/lib/api/client';
import { TutorProfile, UpdateTutorProfileRequest } from '../types';

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    return api.get<TutorProfile>('/api/v1/tutors/profile');
  },

  async updateTutorProfile(request: UpdateTutorProfileRequest): Promise<TutorProfile> {
    return api.put<TutorProfile>('/api/v1/tutors/profile', request);
  }
};
