'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTutorIncomeSummaryQuery } from '../hooks/use-tutor-income-summary-query';
import { Wallet, DollarSign, Clock, ArrowDownToLine, RefreshCcw } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export function TutorIncomeSummaryCards() {
  const { data: summary, isLoading, isError, refetch } = useTutorIncomeSummaryQuery();

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 text-destructive">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-sm font-medium mb-4">Failed to load income summary</p>
          <button 
            onClick={() => refetch()} 
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
          >
            <RefreshCcw className="h-3 w-3" />
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const cards = [
    {
      title: 'Total Earnings',
      value: summary?.totalEarnings,
      icon: DollarSign,
      color: 'text-brand-dark',
      bg: 'bg-primary/10',
      description: 'Lifetime net earnings',
    },
    {
      title: 'Available Balance',
      value: summary?.availableAmount,
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      description: 'Ready for payout',
    },
    {
      title: 'Pending Earnings',
      value: summary?.pendingAmount,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      description: 'Sessions not yet completed',
    },
    {
      title: 'This Month',
      value: summary?.thisMonth,
      icon: ArrowDownToLine,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Earned in the current month',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold tracking-tight text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-full', card.bg)}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[120px] mt-1" />
            ) : (
              <div className="text-2xl font-black text-brand-dark mt-1">
                {formatCurrency(card.value)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
