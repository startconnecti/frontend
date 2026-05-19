'use client';

import { Notification } from '../types';
import { NotificationItem } from './notification-item';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationList({ notifications, onMarkRead, onNotificationClick }: NotificationListProps) {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onMarkRead={onMarkRead}
          onClick={() => onNotificationClick?.(notification)}
        />
      ))}
    </div>
  );
}
