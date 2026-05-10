import { api } from '@/lib/api/client';
import { StudentDashboardData } from '../types';

export const studentDashboardService = {
  async getStudentDashboard(): Promise<StudentDashboardData> {
    return api.get<StudentDashboardData>('/api/v1/students/dashboard');
  }
};
