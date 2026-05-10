'use client';

import { Wallet, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TutorEarnings } from '../types';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

interface TutorEarningsSummaryProps {
  earnings: TutorEarnings;
}

export function TutorEarningsSummary({ earnings }: TutorEarningsSummaryProps) {
  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Earnings Overview</CardTitle>
        <Wallet className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Monthly Revenue</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black" style={{ color: '#2C1208' }}>${earnings.monthlyEarnings}</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              +12%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/5 border border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Pending Payout</p>
            <p className="text-sm font-bold">${earnings.pendingPayoutAmount}</p>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[65%]" />
          </div>
          <p className="text-[10px] text-muted-foreground italic">Scheduled for next Friday</p>
        </div>
      </CardContent>
      <div className="p-4 bg-muted/10 border-t border-border/40">
        <Button variant="ghost" size="sm" className="w-full text-xs font-bold gap-2" asChild>
          <Link href={ROUTES.TUTOR.PAYOUTS}>
            Full Payout History
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
