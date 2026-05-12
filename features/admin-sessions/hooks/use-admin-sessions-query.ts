import { useQuery } from '@tanstack/react-query';
import { adminSessionsService } from '../services/admin-sessions-service';
import { AdminSessionsQueryParams } from '../types';

export function useAdminSessionsQuery(params: AdminSessionsQueryParams) {
  return useQuery({
    queryKey: ['admin-sessions', params],
    queryFn: () => adminSessionsService.getSessions(params),
  });
}
