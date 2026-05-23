'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleMutationError } from '@/lib/api/query-utils';
import { messageService } from '../services/message-service';

export function useMarkConversationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messageService.markConversationAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['messages'] });
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      const previousUnreadCount = queryClient.getQueryData<{ count: number }>(['messages', 'unread-count']);
      const previousConversations = queryClient.getQueriesData({ queryKey: ['conversations'] });
      const previousDetail = queryClient.getQueryData<any>(['conversation-detail', id]);

      let unreadInConversation = 0;
      
      queryClient.setQueriesData({ queryKey: ['conversations'] }, (old: any) => {
        if (!old) return old;
        if (old.items && Array.isArray(old.items)) {
          const conversation = old.items.find((c: any) => c.conversationId === id || c.id === id);
          if (conversation && conversation.unreadCount) {
            unreadInConversation = conversation.unreadCount;
          }
          return {
            ...old,
            items: old.items.map((c: any) => 
              c.conversationId === id || c.id === id ? { ...c, unreadCount: 0 } : c
            )
          };
        }
        return old;
      });

      if (unreadInConversation > 0) {
        queryClient.setQueryData<{ count: number }>(['messages', 'unread-count'], (old) => {
          if (!old) return old;
          return { count: Math.max(0, old.count - unreadInConversation) };
        });
      }

      return { previousUnreadCount, previousConversations, previousDetail };
    },
    onError: (err, id, context) => {
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(['messages', 'unread-count'], context.previousUnreadCount);
      }
      if (context?.previousConversations) {
        context.previousConversations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(['conversation-detail', id], context.previousDetail);
      }
      handleMutationError(err, 'Failed to mark conversation as read');
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-detail', id] });
    },
  });
}
