'use client';

export type BookingStatusFilter = 'all' | 'pending_payment' | 'payment_processing' | 'confirmed' | 'expired' | 'cancelled';

interface BookingFilterTabsProps {
  activeStatus: BookingStatusFilter;
  onStatusChange: (status: BookingStatusFilter) => void;
}

const TABS: { label: string; value: BookingStatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending Payment', value: 'pending_payment' },
  { label: 'Processing', value: 'payment_processing' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function BookingFilterTabs({ activeStatus, onStatusChange }: BookingFilterTabsProps) {
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
