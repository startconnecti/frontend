import { useQuery } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';
import { AdminTutorsQueryParams } from '../types';

export function useAdminTutorsQuery(params: AdminTutorsQueryParams) {
  return useQuery({
    queryKey: ['admin-tutors', params],
    queryFn: () => adminTutorsService.getTutors(params),
  });
}