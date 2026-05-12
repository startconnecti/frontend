import { useQuery } from '@tanstack/react-query';
import { adminTutorsService } from '../services/admin-tutors-service';

export function useAdminTutorDetailQuery(id: string) {
  return useQuery({
    queryKey: ['admin-tutor-detail', id],
    queryFn: () => adminTutorsService.getTutorById(id),
    enabled: Boolean(id),
  });
}