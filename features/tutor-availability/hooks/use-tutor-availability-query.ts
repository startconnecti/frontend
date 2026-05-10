'use client';

import { useQuery } from '@tanstack/react-query';
import { tutorAvailabilityService } from '../services/tutor-availability-service';

export function useTutorAvailabilityQuery() {
  return useQuery({
    queryKey: ['tutor-availability'],
    queryFn: () => tutorAvailabilityService.getTutorAvailability(),
  });
}
