import { TutorDashboardData } from '../types';
import { MOCK_TUTOR_DASHBOARD_DATA } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tutorDashboardService = {
  async getTutorDashboard(): Promise<TutorDashboardData> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    // In a real app, we would fetch based on the logged-in tutor's ID
    return MOCK_TUTOR_DASHBOARD_DATA;
  }
};
