import { api } from '@/lib/api/client';
import { FavoriteTutor } from '../types';

export const favoriteService = {
  async getFavoriteTutors(): Promise<FavoriteTutor[]> {
    return api.get<FavoriteTutor[]>('/api/v1/favorites');
  },

  async removeFavoriteTutor(tutorId: string): Promise<void> {
    await api.delete(`/api/v1/favorites/${tutorId}`);
  }
};
