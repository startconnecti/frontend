'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleMutationError } from '@/lib/api/query-utils';
import { notificationService } from '../services/notification-service';

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markNotificationAsRead(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot the previous values
      const previousUnreadCount = queryClient.getQueryData<{ count: number }>(['notifications', 'unread-count']);
      const previousNotifications = queryClient.getQueriesData({ queryKey: ['notifications'] });

      // Optimistically update the unread count
      queryClient.setQueryData<{ count: number }>(['notifications', 'unread-count'], (old) => {
        if (!old) return old;
        return { count: Math.max(0, old.count - 1) };
      });

      // Optimistically update notifications list
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old) return old;
        if (old.items && Array.isArray(old.items)) {
          return {
            ...old,
            items: old.items.map((item: any) => 
              item.notificationId === id || item.id === id ? { ...item, isRead: true } : item
            )
          };
        }
        if (Array.isArray(old)) {
          return old.map((item: any) => 
            item.notificationId === id || item.id === id ? { ...item, isRead: true } : item
          );
        }
        return old;
      });

      return { previousUnreadCount, previousNotifications };
    },
    onError: (err, id, context) => {
      // Rollback
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousUnreadCount);
      }
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      handleMutationError(err, 'Failed to mark notification as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
}

