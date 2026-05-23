'use client';

import { useQuery } from '@tanstack/react-query';
import { messageService } from '../services/message-service';

import { useAuthStore } from '@/stores/auth-store';

export function useConversationsQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
}
