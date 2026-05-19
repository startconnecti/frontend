'use client';

import { useQuery } from '@tanstack/react-query';
import { tutorService } from '../services/tutor-service';
import { TutorFilters } from '../types';

export function useGetTutors(filters: TutorFilters) {
  return useQuery({
    queryKey: ['tutors', filters],
    queryFn: () => tutorService.getTutorList(filters),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    placeholderData: (previousData) => previousData,
  });
}
