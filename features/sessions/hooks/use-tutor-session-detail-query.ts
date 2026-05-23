'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';

export function useTutorSessionDetailQuery(id: string) {
  return useQuery({
    queryKey: ['tutor-session-detail', id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: Boolean(id && id !== 'undefined' && id !== 'null'),
  });
}
