import { useQuery } from '@tanstack/react-query';
import { TutorFilters } from '../types';
import { tutorService } from '../services/tutor-service';
import { TUTOR_QUERY_KEYS } from '../constants';

export function useTutorListQuery(filters: TutorFilters) {
  return useQuery({
    queryKey: TUTOR_QUERY_KEYS.list(filters),
    queryFn: () => tutorService.getTutorList(filters),
  });
}
