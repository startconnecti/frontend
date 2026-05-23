'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot previous values
      const previousUnreadCount = queryClient.getQueryData<{ count: number }>(['notifications', 'unread-count']);
      const previousNotifications = queryClient.getQueriesData({ queryKey: ['notifications'] });

      // Optimistically update unread count to 0
      queryClient.setQueryData<{ count: number }>(['notifications', 'unread-count'], () => ({ count: 0 }));

      // Optimistically update all notifications to read
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old) return old;
        if (old.items && Array.isArray(old.items)) {
          return {
            ...old,
            items: old.items.map((item: any) => ({ ...item, isRead: true }))
          };
        }
        if (Array.isArray(old)) {
          return old.map((item: any) => ({ ...item, isRead: true }));
        }
        return old;
      });

      return { previousUnreadCount, previousNotifications };
    },
    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousUnreadCount);
      }
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      handleMutationError(err, 'Failed to mark all notifications as read');
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
}
