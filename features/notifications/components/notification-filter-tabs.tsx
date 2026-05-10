'use client';

import { NotificationType } from '../types';

interface NotificationFilterTabsProps {
  activeType: NotificationType | 'all';
  activeStatus: 'all' | 'unread';
  onTypeChange: (type: NotificationType | 'all') => void;
  onStatusChange: (status: 'all' | 'unread') => void;
}

const TYPES: { label: string; value: NotificationType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Bookings', value: 'booking' },
  { label: 'Payments', value: 'payment' },
  { label: 'Sessions', value: 'session' },
  { label: 'Messages', value: 'message' },
  { label: 'System', value: 'system' },
];

export function NotificationFilterTabs({ 
  activeType, 
  activeStatus, 
  onTypeChange, 
  onStatusChange 
}: NotificationFilterTabsProps) {
  return (
    <div className="space-y-4 border-b border-border/40 pb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onStatusChange('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeStatus === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onStatusChange('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeStatus === 'unread'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          Unread
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeType === type.value
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-transparent text-muted-foreground border border-transparent hover:border-border/60'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
