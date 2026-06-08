import { api } from '@/lib/api/client';
import { TutorDashboardData } from '../types';

export const tutorDashboardService = {
  async getTutorDashboard(): Promise<any> {
    return api.get<any>('/api/v1/dashboard');
  },
  async getMyTutorProfile(): Promise<any> {
    try {
      return await api.get<any>('/api/v1/tutor/profile');
    } catch (error: any) {
      // If the API returns a 404, the tutor profile does not exist yet.
      // This happens for newly registered tutors who haven't completed onboarding.
      return { tutorProfile: { status: 'incomplete' } };
    }
  }
};
