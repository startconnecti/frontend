'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/session-service';
import { GetSessionsParams } from '../types/index';

export function useStudentSessionsQuery(params: GetSessionsParams) {
  return useQuery({
    queryKey: ['student-sessions', params.status, params.limit, params.page],
    queryFn: () => sessionService.getSessions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
