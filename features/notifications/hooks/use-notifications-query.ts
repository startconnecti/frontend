'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { NotificationFilters } from '../types';

export function useNotificationsQuery(filters: NotificationFilters) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationService.getNotifications(filters),
  });
}
