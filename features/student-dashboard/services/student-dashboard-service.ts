import { api } from '@/lib/api/client';
import { StudentDashboardData } from '../types';

export const studentDashboardService = {
  async getStudentDashboard(): Promise<any> {
    return api.get<any>('/api/v1/dashboard');
  }
};
