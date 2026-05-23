'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { useAuthStore } from '@/stores/auth-store';

export function useNotificationUnreadCountQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
