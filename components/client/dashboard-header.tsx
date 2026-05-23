'use client';

import { Bell, MessageSquare, Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { useNotificationUnreadCountQuery } from '@/features/notifications/hooks/use-notification-unread-count-query';
import { useMessageUnreadCountQuery } from '@/features/messages/hooks/use-message-unread-count-query';

export function DashboardHeader() {
  const openMobileSidebar = useUIStore((state) => state.openMobileSidebar);
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const { data: notificationData } = useNotificationUnreadCountQuery();
  const { data: messageData } = useMessageUnreadCountQuery();

  const unreadNotificationCount = notificationData?.count ?? 0;
  const unreadMessageCount = messageData?.count ?? 0;

  const renderBadge = (count: number) => {
    if (count <= 0) return null;
    const displayCount = count > 99 ? '99+' : count.toString();
    return (
      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground transform translate-x-1/4 -translate-y-1/4">
        {displayCount}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 sm:px-6">
      {/* Mobile Menu Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden text-muted-foreground"
        onClick={openMobileSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
        {/* Actions */}
        <div className="flex items-center gap-x-3 lg:gap-x-5">
          <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="Messages" asChild>
            <Link href={ROUTES.MESSAGES}>
              <MessageSquare className="h-5 w-5" />
              {renderBadge(unreadMessageCount)}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="Notifications" asChild>
            <Link href={ROUTES.NOTIFICATIONS}>
              <Bell className="h-5 w-5" />
              {renderBadge(unreadNotificationCount)}
            </Link>
          </Button>

          <div className="h-6 w-px bg-border lg:block" />

          {/* User Profile Area */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">{user?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || ''}</p>
            </div>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback className="bg-primary/5 text-primary">
                {user?.fullName ? getInitials(user.fullName) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
