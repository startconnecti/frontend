import { api } from '@/lib/api/client';
import { Notification, NotificationFilters } from '../types';

export const notificationService = {
  async getNotifications(filters: NotificationFilters): Promise<Notification[]> {
    return api.get<Notification[]>('/api/v1/notifications', { params: filters as any });
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/${id}/read`);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await api.post('/api/v1/notifications/read-all');
  }
};
