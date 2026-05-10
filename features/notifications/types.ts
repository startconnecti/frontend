export type NotificationType = 
  | 'booking' 
  | 'payment' 
  | 'session' 
  | 'message' 
  | 'tutor_profile' 
  | 'payout' 
  | 'dispute' 
  | 'refund' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  actionHref?: string;
}

export interface NotificationFilters {
  status: 'all' | 'unread';
  type: NotificationType | 'all';
}
