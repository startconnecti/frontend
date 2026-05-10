import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex justify-between py-2.5 border-b border-border/40 last:border-0 gap-4", className)}>
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
