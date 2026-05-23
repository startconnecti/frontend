import { api } from '@/lib/api/client';
import { Notification, NotificationFilters } from '../types';

export const notificationService = {
  async getNotifications(filters: NotificationFilters): Promise<Notification[]> {
    const params = { ...filters } as any;
    if (params.status === 'unread') {
      params.isRead = false;
    }
    delete params.status;

    if (params.type === 'all') {
      delete params.type;
    }
    return api.get<Notification[]>('/api/v1/notifications', { params });
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/${id}/read`);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await api.post('/api/v1/notifications/read-all');
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/api/v1/notifications/unread-count');
  }
};
