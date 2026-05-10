'use client';

import { useQuery } from '@tanstack/react-query';
import { messageService } from '../services/message-service';

export function useConversationDetailQuery(id: string) {
  return useQuery({
    queryKey: ['conversation-detail', id],
    queryFn: async () => {
      const [conversation, messages] = await Promise.all([
        messageService.getConversationById(id),
        messageService.getMessagesByConversationId(id),
      ]);
      return { conversation, messages };
    },
    enabled: !!id,
  });
}
