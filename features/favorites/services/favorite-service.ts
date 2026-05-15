import { api } from '@/lib/api/client';
import { FavoriteTutor } from '../types';
import { ListResponse } from '@/lib/api/types';

export const favoriteService = {
  async getFavoriteTutors(): Promise<ListResponse<FavoriteTutor>> {
    const response = await api.get<any>('/api/v1/me/favorite-tutors');
    if (Array.isArray(response)) {
      return { items: response, total: response.length, limit: response.length, offset: 0 };
    }
    
    return {
      items: response?.items ?? response?.data ?? [],
      total: response?.total ?? 0,
      limit: response?.limit ?? 10,
      offset: response?.offset ?? 0
    };
  },

  async removeFavoriteTutor(tutorId: string): Promise<void> {
    await api.delete(`/api/v1/me/favorite-tutors/${tutorId}`);
  }
};
