import { FavoriteTutor } from '../types';
import { MOCK_FAVORITE_TUTORS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory storage for the current session since we want to demonstrate removal
let favoritesStorage = [...MOCK_FAVORITE_TUTORS];

export const favoriteService = {
  async getFavoriteTutors(): Promise<FavoriteTutor[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return [...favoritesStorage];
  },

  async removeFavoriteTutor(favoriteId: string): Promise<void> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    favoritesStorage = favoritesStorage.filter(f => f.favoriteId !== favoriteId);
  }
};
