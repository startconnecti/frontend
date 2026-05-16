'use client';

export type SessionStatusFilter = 'scheduled' | 'completed' | 'all';

interface SessionFilterTabsProps {
  activeStatus: SessionStatusFilter;
  onStatusChange: (status: SessionStatusFilter) => void;
}

const TABS: { label: string; value: SessionStatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
];

export function SessionFilterTabs({ activeStatus, onStatusChange }: SessionFilterTabsProps) {
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
