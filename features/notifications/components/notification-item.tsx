'use client';

import { 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Settings, 
  Bell, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const TYPE_ICONS = {
  booking: Calendar,
  payment: CreditCard,
  session: Calendar,
  message: MessageSquare,
  tutor_profile: Settings,
  payout: CreditCard,
  dispute: ShieldCheck,
  refund: AlertCircle,
  system: Bell,
};

const TYPE_COLORS = {
  booking: 'text-blue-600 bg-blue-100',
  payment: 'text-emerald-600 bg-emerald-100',
  session: 'text-purple-600 bg-purple-100',
  message: 'text-amber-600 bg-amber-100',
  tutor_profile: 'text-slate-600 bg-slate-100',
  payout: 'text-emerald-600 bg-emerald-100',
  dispute: 'text-rose-600 bg-rose-100',
  refund: 'text-rose-600 bg-rose-100',
  system: 'text-slate-600 bg-slate-100',
};

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Icon = TYPE_ICONS[notification.type] || Bell;
  const colorClass = TYPE_COLORS[notification.type] || 'text-slate-600 bg-slate-100';

  return (
    <div 
      className={cn(
        "flex gap-4 p-5 rounded-2xl transition-all border border-transparent",
        !notification.isRead ? "bg-primary/5 border-primary/10 shadow-sm" : "hover:bg-muted/30"
      )}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
    >
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
        <Icon className="h-6 w-6" />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h4 className={cn(
            "text-sm font-black leading-tight",
            !notification.isRead ? "text-primary" : "text-muted-foreground"
          )} style={!notification.isRead ? { color: '#2C1208' } : {}}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap pt-0.5">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className={cn(
          "text-sm font-medium leading-relaxed",
          !notification.isRead ? "text-foreground" : "text-muted-foreground"
        )}>
          {notification.content}
        </p>

        {notification.actionHref && (
          <div className="pt-2">
            <Link 
              href={notification.actionHref}
              className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline"
            >
              Take Action
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {!notification.isRead && (
        <div className="flex items-center px-1">
          <div className="h-3 w-3 rounded-full bg-primary shadow-sm" />
        </div>
      )}
    </div>
  );
}
