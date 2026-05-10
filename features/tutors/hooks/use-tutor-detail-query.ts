import { useQuery } from '@tanstack/react-query';
import { tutorService } from '../services/tutor-service';
import { TUTOR_QUERY_KEYS } from '../constants';

export function useTutorDetailQuery(id: string) {
  return useQuery({
    queryKey: TUTOR_QUERY_KEYS.detail(id),
    queryFn: () => tutorService.getTutorById(id),
    enabled: !!id,
  });
}
