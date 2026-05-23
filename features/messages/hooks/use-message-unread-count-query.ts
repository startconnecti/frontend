'use client';

import { useQuery } from '@tanstack/react-query';
import { messageService } from '../services/message-service';
import { useAuthStore } from '@/stores/auth-store';

export function useMessageUnreadCountQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: () => messageService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
