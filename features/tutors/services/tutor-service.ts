import { api } from '@/lib/api/client';
import { Tutor, TutorFilters } from '../types';

export const FALLBACK_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
  'Spanish', 'French', 'Computer Science', 'History', 'Geography'
];

export const tutorService = {
  async getTutors(filters: TutorFilters): Promise<Tutor[]> {
    const response = await api.get<any>('/api/v1/tutors', { params: filters as any });
    
    // Handle different response shapes safely
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response && typeof response === 'object') {
      // Handle { items: [], total: 10 } or { data: [], meta: {} }
      return response.items || response.data || [];
    }
    
    return [];
  },

  async getTutorById(id: string, publicOnly: boolean = false): Promise<Tutor | null> {
    try {
      const tutor = await api.get<Tutor>(`/api/v1/tutors/${id}`);
      
      if (publicOnly && (tutor.approvalStatus !== 'approved' || !tutor.isPublic)) {
        return null;
      }
      
      return tutor;
    } catch (error) {
      // Return null for 404 or other errors during fetching individual tutor
      return null;
    }
  },

  async getSubjects(): Promise<string[]> {
    try {
      return await api.get<string[]>('/api/v1/subjects');
    } catch (error) {
      // Fallback if endpoint is not available
      return FALLBACK_SUBJECTS;
    }
  }
};
