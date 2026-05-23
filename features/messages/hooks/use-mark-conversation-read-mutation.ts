'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleMutationError } from '@/lib/api/query-utils';
import { messageService } from '../services/message-service';

export function useMarkConversationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messageService.markConversationAsRead(id),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-detail', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to mark conversation as read');
    },
  });
}
