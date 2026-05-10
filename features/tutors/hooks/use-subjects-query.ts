import { useQuery } from '@tanstack/react-query';
import { tutorService } from '../services/tutor-service';
import { TUTOR_QUERY_KEYS } from '../constants';

export function useSubjectsQuery() {
  return useQuery({
    queryKey: TUTOR_QUERY_KEYS.subjects(),
    queryFn: () => tutorService.getSubjects(),
    staleTime: 1000 * 60 * 60, // 1 hour - subjects don't change often
  });
}
