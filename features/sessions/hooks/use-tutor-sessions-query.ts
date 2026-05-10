'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';
import { SessionFilters } from '../types';

export function useTutorSessionsQuery(filters: SessionFilters) {
  return useQuery({
    queryKey: ['tutor-sessions', filters],
    queryFn: () => sessionService.getTutorSessions(filters),
  });
}
