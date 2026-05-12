import { adminApi } from '@/lib/admin-api/client';
import type { AdminAuditLogItem, AdminAuditLogsListResponse, AdminAuditLogsQueryParams } from '../types';

interface RawAuditLogItem {
  id?: string;
  logId?: string;
  actorId?: string;
  actorEmail?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: string;
}

function normalizeAuditLog(item: RawAuditLogItem): AdminAuditLogItem {
  return {
    id: item.id ?? item.logId ?? '',
    actorId: item.actorId ?? '-',
    actorEmail: item.actorEmail ?? '-',
    action: item.action ?? '-',
    entityType: item.entityType ?? '-',
    entityId: item.entityId ?? '-',
    ipAddress: item.ipAddress ?? '-',
    userAgent: item.userAgent ?? '-',
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  };
}

export const adminAuditLogsService = {
  async listAuditLogs(params: AdminAuditLogsQueryParams): Promise<AdminAuditLogsListResponse> {
    const offset = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const limit = params.limit ?? 10;

    try {
      const response = await adminApi.get<{
        items: RawAuditLogItem[];
        pagination?: { limit: number; offset: number; total: number };
      }>('/api/v1/admin/audit-logs', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
        },
      });

      const total = response.data.pagination?.total ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        items: (response.data.items ?? []).map(normalizeAuditLog),
        pagination: response.data.pagination,
        page: params.page ?? 1,
        totalPages,
      };
    } catch {
      return {
        items: [],
        pagination: { limit, offset: 0, total: 0 },
        page: params.page ?? 1,
        totalPages: 0,
      };
    }
  },
};
