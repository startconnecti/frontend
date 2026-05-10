'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';
import { SessionFilters } from '../types';

export function useStudentSessionsQuery(filters: SessionFilters) {
  return useQuery({
    queryKey: ['student-sessions', filters],
    queryFn: () => sessionService.getStudentSessions(filters),
  });
}
