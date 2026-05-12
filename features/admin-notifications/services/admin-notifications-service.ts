import { adminApi } from '@/lib/admin-api/client';
import type { AdminNotificationItem, AdminNotificationsListResponse, AdminNotificationsQueryParams } from '../types';

interface RawNotificationItem {
  id?: string;
  notificationId?: string;
  title?: string;
  message?: string;
  type?: string;
  recipientRole?: string;
  createdAt?: string;
  read?: boolean;
}

function normalizeNotificationType(type?: string): 'info' | 'warning' | 'error' | 'success' {
  if (!type) return 'info';
  const lowerType = type.toLowerCase();
  if (lowerType === 'info' || lowerType === 'information') return 'info';
  if (lowerType === 'warning') return 'warning';
  if (lowerType === 'error' || lowerType === 'danger') return 'error';
  if (lowerType === 'success') return 'success';
  return 'info';
}

function normalizeNotification(item: RawNotificationItem | null | undefined): AdminNotificationItem {
  if (!item) {
    return {
      id: '',
      title: '-',
      message: '-',
      type: 'info',
      recipientRole: 'all' as any,
      createdAt: new Date(0).toISOString(),
      read: false,
    };
  }

  return {
    id: item.id ?? item.notificationId ?? '',
    title: item.title ?? '-',
    message: item.message ?? '-',
    type: normalizeNotificationType(item.type),
    recipientRole: ((item.recipientRole?.toLowerCase() as any) ?? 'all'),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    read: item.read ?? false,
  };
}

export const adminNotificationsService = {
  async listNotifications(params: AdminNotificationsQueryParams): Promise<AdminNotificationsListResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      const response = await adminApi.get<any>('/api/v1/admin/notifications', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
          ...(params.type && { type: params.type }),
        },
      });

      let rawItems: RawNotificationItem[] = [];
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
        items: rawItems.map(normalizeNotification),
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
