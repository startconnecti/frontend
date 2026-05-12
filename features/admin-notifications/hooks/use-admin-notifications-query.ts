import { useQuery } from '@tanstack/react-query';
import { adminNotificationsService } from '../services/admin-notifications-service';
import type { AdminNotificationsQueryParams } from '../types';

export function useAdminNotificationsQuery(params: AdminNotificationsQueryParams) {
  return useQuery({
    queryKey: ['admin-notifications', params],
    queryFn: () => adminNotificationsService.listNotifications(params),
    staleTime: 30000,
  });
}
