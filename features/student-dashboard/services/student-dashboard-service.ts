import { StudentDashboardData } from '../types';
import { MOCK_STUDENT_DASHBOARD_DATA } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const studentDashboardService = {
  async getStudentDashboard(): Promise<StudentDashboardData> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    // In a real app, we would fetch based on the logged-in user's ID
    return MOCK_STUDENT_DASHBOARD_DATA;
  }
};
