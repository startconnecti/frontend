'use client';

import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite-service';

export function useFavoriteTutorsQuery() {
  return useQuery({
    queryKey: ['favorite-tutors'],
    queryFn: () => favoriteService.getFavoriteTutors(),
  });
}
