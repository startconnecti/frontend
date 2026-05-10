'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';

export function useSessionDetailQuery(id: string) {
  return useQuery({
    queryKey: ['session-detail', id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
  });
}
