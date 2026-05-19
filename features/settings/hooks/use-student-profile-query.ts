'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';

export function useStudentProfileQuery() {
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: () => settingsService.getStudentProfile(),
  });
}
