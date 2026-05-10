'use client';

import { useQuery } from '@tanstack/react-query';
import { messageService } from '../services/message-service';

export function useConversationsQuery() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  });
}
