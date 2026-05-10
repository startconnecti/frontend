'use client';

import { useQuery } from '@tanstack/react-query';
import { tutorDashboardService } from '../services/tutor-dashboard-service';

export function useTutorDashboardQuery() {
  return useQuery({
    queryKey: ['tutor-dashboard'],
    queryFn: () => tutorDashboardService.getTutorDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
