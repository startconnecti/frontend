import { Session, SessionFilters } from '../types';
import { MOCK_SESSIONS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sessionService = {
  async getStudentSessions(filters: SessionFilters): Promise<Session[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    let filtered = [...MOCK_SESSIONS];
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    // Sort by start time (newest first for completed/cancelled, closest for scheduled)
    return filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  },

  async getSessionById(id: string): Promise<Session | null> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    return MOCK_SESSIONS.find(s => s.id === id) || null;
  }
};
