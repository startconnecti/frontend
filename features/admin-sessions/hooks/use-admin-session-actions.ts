'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSessionsService } from '../services/admin-sessions-service';
import { toast } from 'sonner';

export function useAdminSessionDetailQuery(id: string) {
  return useQuery({
    queryKey: ['admin', 'sessions', id],
    queryFn: () => adminSessionsService.getSessionById(id),
    enabled: !!id,
  });
}

export function useAdminCancelSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminSessionsService.cancelSession(id, reason),
    onSuccess: (_, { id }) => {
      toast.success('Session cancelled successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to cancel session.');
    },
  });
}

export function useAdminForceCompleteSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminSessionsService.forceCompleteSession(id, reason),
    onSuccess: (_, { id }) => {
      toast.success('Session forcefully completed.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to complete session.');
    },
  });
}
