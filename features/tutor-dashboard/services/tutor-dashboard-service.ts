import { api } from '@/lib/api/client';
import { TutorDashboardData } from '../types';

export const tutorDashboardService = {
  async getTutorDashboard(): Promise<any> {
    return api.get<any>('/api/v1/dashboard');
  },
  async getMyTutorProfile(): Promise<any> {
    return api.get<any>('/api/v1/tutor/profile');
  }
};
