import { api } from '@/lib/api/client';
import { TutorDashboardData } from '../types';

export const tutorDashboardService = {
  async getTutorDashboard(): Promise<TutorDashboardData> {
    return api.get<TutorDashboardData>('/api/v1/tutors/dashboard');
  }
};
