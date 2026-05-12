export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type RecipientRole = 'student' | 'tutor' | 'admin' | 'all';

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientRole: RecipientRole;
  createdAt: string;
  read: boolean;
}

export interface AdminNotificationsListResponse {
  items: AdminNotificationItem[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
  page: number;
  totalPages: number;
}

export interface AdminNotificationsQueryParams {
  keyword?: string;
  type?: NotificationType;
  page?: number;
  limit?: number;
}
