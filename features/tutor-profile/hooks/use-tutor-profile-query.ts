'use client';

import { useQuery } from '@tanstack/react-query';
import { tutorProfileService } from '../services/tutor-profile-service';

export function useTutorProfileQuery() {
  return useQuery({
    queryKey: ['tutor-profile-management'],
    queryFn: () => tutorProfileService.getTutorProfile(),
  });
}
