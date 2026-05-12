import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsService } from '../services/admin-audit-logs-service';
import type { AdminAuditLogsQueryParams } from '../types';

export function useAdminAuditLogsQuery(params: AdminAuditLogsQueryParams) {
  return useQuery({
    queryKey: ['admin-audit-logs', params],
    queryFn: () => adminAuditLogsService.listAuditLogs(params),
    staleTime: 30000,
  });
}
