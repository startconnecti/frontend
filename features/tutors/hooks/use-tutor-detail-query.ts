import { useQuery } from '@tanstack/react-query';
import { tutorService } from '../services/tutor-service';
import { TUTOR_QUERY_KEYS } from '../constants';

export function useTutorDetailQuery(id: string, publicOnly: boolean = false) {
  return useQuery({
    queryKey: [...TUTOR_QUERY_KEYS.detail(id), { publicOnly }],
    queryFn: () => tutorService.getTutorById(id, publicOnly),
    enabled: !!id,
  });
}
