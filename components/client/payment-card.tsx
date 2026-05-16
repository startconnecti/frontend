import { Calendar, CreditCard, Wallet } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ClientStatusBadge, AllStatuses } from '@/components/shared/client-status-badge';
import { cn } from '@/lib/utils';

interface PaymentCardProps {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: AllStatuses;
  type?: 'inbound' | 'outbound';
  currency?: string;
  method?: string;
  onViewReceipt?: () => void;
}

export function PaymentCard({
  id,
  amount,
  date,
  description,
  status,
  currency = 'VND',
  method,
  onViewReceipt
}: PaymentCardProps) {
  
  // Helper to format method
  const formatMethod = (m?: string) => {
    if (!m) return 'N/A';
    return m.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper to format amount
  const formatAmount = (amt: number, curr: string) => {
    if (curr === 'VND') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amt);
  };

  return (
    <Card 
      className="rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={onViewReceipt}
    >
      {/* Header */}
      <CardHeader className="p-4 flex flex-row justify-between items-center border-b border-border/50">
        <span className="text-xs font-mono text-muted-foreground">ID: {id.slice(0, 8)}...</span>
        <ClientStatusBadge status={status} className="text-[10px] h-5 px-2" />
      </CardHeader>

      {/* Body */}
      <CardContent className="p-4 space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {formatAmount(amount, currency)}
        </div>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </div>
        <div className="flex items-center gap-1.5">
          {method?.toLowerCase().includes('bank') || method?.toLowerCase().includes('momo') ? (
            <Wallet className="h-3.5 w-3.5" />
          ) : (
            <CreditCard className="h-3.5 w-3.5" />
          )}
          {formatMethod(method)}
        </div>
      </CardFooter>
    </Card>
  );
}
