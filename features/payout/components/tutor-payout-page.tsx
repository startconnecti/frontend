'use client';

import { useState } from 'react';
import { payoutQueryKeys } from '../queries';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';
import { ArrowUpRight, Calendar, Landmark, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTutorPayoutSummaryQuery } from '../hooks/use-tutor-payout-summary-query';

// Mock Payout History Data
const mockPayouts = [
  {
    id: 'PO-9001',
    date: '2026-05-15',
    amount: 250.00,
    method: 'Bank Transfer (ACB ****5678)',
    status: 'processed',
  },
  {
    id: 'PO-9002',
    date: '2026-05-01',
    amount: 180.00,
    method: 'Bank Transfer (ACB ****5678)',
    status: 'processed',
  },
  {
    id: 'PO-9003',
    date: '2026-05-18',
    amount: 370.00,
    method: 'Bank Transfer (ACB ****5678)',
    status: 'pending',
  },
  {
    id: 'PO-9004',
    date: '2026-04-15',
    amount: 300.00,
    method: 'PayPal (tutor.payment@example.com)',
    status: 'failed',
  },
];

export function TutorPayoutPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: summary, isLoading, isError, refetch } = useTutorPayoutSummaryQuery();
  
  const formatCurrency = (amount: number | undefined, currency?: string) => {
    if (amount === undefined || isNaN(amount)) return '₩0';
    if (currency === PLATFORM_CURRENCY || !currency) {
      return `₩${amount.toLocaleString('ko-KR')}`;
    }
    // Fallback for other currencies if they ever appear
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  const availableBalance = summary?.availableBalance ?? 0;

  const handleRequestPayout = () => {
    if (availableBalance <= 0) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have any funds available for payout.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Removed setAvailableBalance(0) since it's driven by real query data now
      // Query cache invalidation would go here in real mutation
      toast({
        title: 'Payout Requested Successfully',
        description: 'Your payout request of $370.00 has been submitted and is processing.',
      });
    }, 1500);
  };

  return (
    <PageContainer className="py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Payouts"
          description="Manage your funds withdrawal and view your historical payouts."
        />
      </div>

      {/* Main Balance and Request Card */}
      <Card className="relative overflow-hidden border-border/60 shadow-xl bg-gradient-to-br from-brand-dark to-slate-900 text-white rounded-3xl p-8 lg:p-10 group">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 h-72 w-72 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-all duration-500" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Landmark className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider">Current Available Balance</span>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                <Skeleton className="h-[60px] lg:h-[72px] w-[200px] bg-primary-foreground/20 rounded-xl" />
              ) : isError ? (
                <div className="flex flex-col items-start gap-2 py-2">
                  <h2 className="text-2xl font-bold tracking-tight text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    Unable to load payout summary
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetch()} 
                    className="text-primary-foreground border-primary-foreground/20 bg-transparent hover:bg-primary-foreground/10"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <h2 className="text-5xl lg:text-6xl font-black tracking-tight">{formatCurrency(availableBalance, summary?.currency)}</h2>
              )}
              {!isError && <p className="text-xs text-primary-foreground/50 font-medium">Clearance period has ended. Ready for withdrawal.</p>}
            </div>
          </div>
          
          <Button 
            onClick={handleRequestPayout}
            disabled={isSubmitting || availableBalance <= 0}
            className="w-full md:w-auto font-black text-sm uppercase tracking-wider py-6 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02] shrink-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                Processing Request...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Request Payout
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Clearance', value: summary?.pendingPayoutAmount },
          { label: 'Processing Payouts', value: summary?.processingPayoutAmount },
          { label: 'Completed This Month', value: summary?.completedThisMonthAmount },
          { label: 'Lifetime Earnings', value: summary?.lifetimeEarningsAmount },
        ].map((metric, i) => (
          <Card key={i} className="border-border/60 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{metric.label}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-[120px] rounded-lg" />
              ) : isError ? (
                <p className="text-sm font-bold text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Error
                </p>
              ) : (
                <p className="text-xl md:text-2xl font-black text-brand-dark tracking-tight">
                  {formatCurrency(metric.value, summary?.currency)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payout History Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight text-brand-dark">Payout History</h3>
        
        <Card className="border-border/60 shadow-md overflow-hidden rounded-3xl">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 pl-6">Date Requested</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Amount Requested</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Method</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => (
                <TableRow key={payout.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-medium text-sm py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(payout.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-sm text-brand-dark py-4">
                    ${payout.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-muted-foreground py-4">
                    {payout.method}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Badge 
                      variant="outline" 
                      className={`font-black tracking-wider text-[10px] uppercase px-3 py-1 rounded-full ${
                        payout.status === 'processed' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : payout.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {payout.status === 'processed' && <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />}
                        {payout.status === 'pending' && <Clock className="h-3 w-3 stroke-[2.5]" />}
                        {payout.status === 'failed' && <XCircle className="h-3 w-3 stroke-[2.5]" />}
                        {payout.status}
                      </span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  );
}
