import { useQuery } from '@tanstack/react-query';
import { adminSubjectsService } from '../services/admin-subjects-service';
import type { AdminSubjectsQueryParams } from '../types';

export function useAdminSubjectsQuery(params: AdminSubjectsQueryParams) {
  return useQuery({
    queryKey: ['admin-subjects', params],
    queryFn: () => adminSubjectsService.listSubjects(params),
    staleTime: 30000,
  });
}
