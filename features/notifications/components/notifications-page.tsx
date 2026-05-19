'use client';

import { useState } from 'react';
import { CheckCheck, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useNotificationsQuery } from '../hooks/use-notifications-query';
import { useMarkNotificationReadMutation } from '../hooks/use-mark-notification-read-mutation';
import { useMarkAllNotificationsReadMutation } from '../hooks/use-mark-all-notifications-read-mutation';
import { Notification, NotificationFilters, NotificationType } from '../types';
import { NotificationFilterTabs } from './notification-filter-tabs';
import { NotificationList } from './notification-list';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function NotificationsPage() {
  const [filters, setFilters] = useState<NotificationFilters>({
    status: 'all',
    type: 'all',
  });
  const [selectedNoti, setSelectedNoti] = useState<Notification | null>(null);

  const { data, isLoading, isError, error, refetch } = useNotificationsQuery(filters);
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications: Notification[] = ((data as any)?.items || []).map((item: any) => ({
    id: item.notificationId,
    type: item.type,
    title: item.title,
    content: item.content,
    isRead: item.isRead,
    createdAt: item.createdAt,
    actionHref: item.actionHref,
  }));

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
        error={error as Error}
        isEmpty={notifications.length === 0}
        emptyTitle="No notifications"
        emptyDescription="You're all caught up! There are no notifications to show right now."
        onRetry={() => refetch()}
      >
        <NotificationList 
          notifications={notifications} 
          onMarkRead={(id) => markReadMutation.mutate(id)}
          onNotificationClick={(notification) => setSelectedNoti(notification)}
        />
      </ListState>

      <Dialog open={!!selectedNoti} onOpenChange={(open) => !open && setSelectedNoti(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-brand-dark pr-6">
              {selectedNoti?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {selectedNoti && formatDistanceToNow(new Date(selectedNoti.createdAt), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-sm font-medium leading-relaxed text-foreground whitespace-pre-wrap">
            {selectedNoti?.content}
          </div>
          {selectedNoti?.actionHref && (
            <div className="mt-6 flex justify-end">
              <Button asChild className="font-bold rounded-xl px-6">
                <Link href={selectedNoti.actionHref} onClick={() => setSelectedNoti(null)}>
                  Take Action
                </Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
