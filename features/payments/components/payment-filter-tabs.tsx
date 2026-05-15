'use client';

import { PaymentStatus } from '../types';

interface PaymentFilterTabsProps {
  activeStatus: PaymentStatus | 'all';
  onStatusChange: (status: PaymentStatus | 'all') => void;
}

const TABS: { label: string; value: PaymentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Waiting Confirmation', value: 'waiting_admin_confirmation' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

export function PaymentFilterTabs({ activeStatus, onStatusChange }: PaymentFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onStatusChange(tab.value)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeStatus === tab.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
