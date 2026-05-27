import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminSystemConfigService } from '../services/admin-system-config-service';
import type { AdminSystemConfig, SystemConfigCategory, SystemConfigsListResponse } from '../types';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const systemConfigKeys = {
  all: ['admin-system-configs'] as const,
  byCategory: (category: SystemConfigCategory) => ['admin-system-configs', category] as const,
  single: (key: string) => ['admin-system-config', key] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAdminSystemConfigsQuery(category?: SystemConfigCategory) {
  return useQuery<SystemConfigsListResponse, Error>({
    queryKey: category ? systemConfigKeys.byCategory(category) : systemConfigKeys.all,
    queryFn: () => adminSystemConfigService.getSystemConfigs(category),
    staleTime: 30_000,
  });
}

export function useAdminSystemConfigQuery(key: string) {
  return useQuery<AdminSystemConfig, Error>({
    queryKey: systemConfigKeys.single(key),
    queryFn: () => adminSystemConfigService.getSystemConfig(key),
    staleTime: 30_000,
    enabled: !!key,
  });
}

export function useUpdateSystemConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation<AdminSystemConfig, Error, { key: string; value: unknown }>({
    mutationFn: ({ key, value }) => adminSystemConfigService.updateSystemConfig(key, value),
    onSuccess: (updated) => {
      // Invalidate all list queries so the updated value propagates everywhere
      queryClient.invalidateQueries({ queryKey: systemConfigKeys.all });
      // Also update the single-config cache directly for instant feedback
      queryClient.setQueryData(systemConfigKeys.single(updated.key), updated);
      toast.success('Setting saved successfully');
    },
    onError: (error) => {
      const message = error.message ?? 'Failed to save setting';
      toast.error(message);
    },
  });
}
