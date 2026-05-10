import { Notification, NotificationFilters } from '../types';
import { MOCK_NOTIFICATIONS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let notificationStorage = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(filters: NotificationFilters): Promise<Notification[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    let filtered = [...notificationStorage];
    
    if (filters.status === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    notificationStorage = notificationStorage.map(n => 
      n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    );
  },

  async markAllNotificationsAsRead(): Promise<void> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    notificationStorage = notificationStorage.map(n => 
      ({ ...n, isRead: true, readAt: new Date().toISOString() })
    );
  }
};
