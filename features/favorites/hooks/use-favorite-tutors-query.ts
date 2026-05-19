'use client';

import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite-service';

export function useFavoriteTutorsQuery(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['favorite-tutors', page, limit],
    queryFn: () => favoriteService.getFavoriteTutors(page, limit),
    placeholderData: (previousData) => previousData,
  });
}
