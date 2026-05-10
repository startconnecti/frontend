'use client';

import { useQuery } from '@tanstack/react-query';
import { studentDashboardService } from '../services/student-dashboard-service';

export function useStudentDashboardQuery() {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => studentDashboardService.getStudentDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
