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

function normalizeNotification(item: RawNotificationItem): AdminNotificationItem {
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
    const offset = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const limit = params.limit ?? 10;

    try {
      const response = await adminApi.get<{
        items: RawNotificationItem[];
        pagination?: { limit: number; offset: number; total: number };
      }>('/api/v1/admin/notifications', {
        params: {
          limit,
          offset,
          ...(params.keyword && { keyword: params.keyword }),
          ...(params.type && { type: params.type }),
        },
      });

      const total = response.data.pagination?.total ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        items: (response.data.items ?? []).map(normalizeNotification),
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
