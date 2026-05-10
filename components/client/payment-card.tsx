import { CreditCard, ArrowDownRight, ArrowUpRight, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ClientStatusBadge, AllStatuses } from '@/components/shared/client-status-badge';
import { cn } from '@/lib/utils';

interface PaymentCardProps {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: AllStatuses;
  type: 'inbound' | 'outbound';
  onViewReceipt?: () => void;
}

export function PaymentCard({
  id,
  amount,
  date,
  description,
  status,
  type,
  onViewReceipt
}: PaymentCardProps) {
  const isPositive = type === 'inbound';

  return (
    <Card className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors cursor-pointer border-border/50" onClick={onViewReceipt}>
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
        isPositive ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
      )}>
        {isPositive ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate">{description}</h4>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <p className={cn(
          "font-bold text-sm",
          isPositive ? "text-emerald-600" : "text-foreground"
        )}>
          {isPositive ? '+' : '-'}${Math.abs(amount).toFixed(2)}
        </p>
        <ClientStatusBadge status={status} className="text-[9px] h-4 px-1.5" />
      </div>
    </Card>
  );
}
