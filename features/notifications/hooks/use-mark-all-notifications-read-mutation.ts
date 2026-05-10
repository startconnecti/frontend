'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { toast } from 'sonner';

import { handleMutationError } from '@/lib/api/query-utils';

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to mark notifications as read');
    },
  });
}
