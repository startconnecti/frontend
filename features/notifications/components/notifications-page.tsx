'use client';

import { useState } from 'react';
import { CheckCheck, Bell } from 'lucide-react';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useNotificationsQuery } from '../hooks/use-notifications-query';
import { useMarkNotificationReadMutation } from '../hooks/use-mark-notification-read-mutation';
import { useMarkAllNotificationsReadMutation } from '../hooks/use-mark-all-notifications-read-mutation';
import { NotificationFilters, NotificationType } from '../types';
import { NotificationFilterTabs } from './notification-filter-tabs';
import { NotificationList } from './notification-list';

export function NotificationsPage() {
  const [filters, setFilters] = useState<NotificationFilters>({
    status: 'all',
    type: 'all',
  });

  const { data: notifications = [], isLoading, isError, refetch } = useNotificationsQuery(filters);
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const handleTypeChange = (type: NotificationType | 'all') => {
    setFilters(prev => ({ ...prev, type }));
  };

  const handleStatusChange = (status: 'all' | 'unread') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Notifications"
          description="Stay updated with your latest activities and alerts."
        />
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            className="font-bold gap-2 text-xs"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <NotificationFilterTabs 
        activeType={filters.type}
        activeStatus={filters.status}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
      />

      <ListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={notifications.length === 0}
        emptyTitle="No notifications"
        emptyDescription="You're all caught up! There are no notifications to show right now."
        onRetry={() => refetch()}
      >
        <NotificationList 
          notifications={notifications} 
          onMarkRead={(id) => markReadMutation.mutate(id)}
        />
      </ListState>
    </PageContainer>
  );
}
