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

function normalizeAuditLog(item: RawAuditLogItem | null | undefined): AdminAuditLogItem {
  if (!item) {
    return {
      id: '',
      actorId: '-',
      actorEmail: '-',
      action: '-',
      entityType: '-',
      entityId: '-',
      ipAddress: '-',
      userAgent: '-',
      createdAt: new Date(0).toISOString(),
    };
  }

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
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      const response = await adminApi.get<any>('/api/v1/admin/audit-logs', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
        },
      });

      let rawItems: RawAuditLogItem[] = [];
      let total = 0;
      let paginationData = null;

      if (Array.isArray(response)) {
        rawItems = response;
        total = response.length;
      } else if (response && typeof response === 'object') {
        rawItems = response.items ?? response.data ?? [];
        paginationData = response.pagination;
        total = paginationData?.total ?? rawItems.length;
      }

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        items: rawItems.map(normalizeAuditLog),
        pagination: paginationData ?? { limit, offset, total },
        page,
        totalPages,
      };
    } catch {
      return {
        items: [],
        pagination: { limit, offset: 0, total: 0 },
        page,
        totalPages: 0,
      };
    }
  },
};
