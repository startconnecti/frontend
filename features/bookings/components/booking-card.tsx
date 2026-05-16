'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from './countdown-timer';
import { BookingStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BookingCardProps {
  id: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  amount: string;
  status: BookingStatus;
  expiresAt?: string;
  onCancel: () => void;
  onPay?: () => void;
  isPaying?: boolean;
}

export function BookingCard({
  tutorName,
  subject,
  date,
  time,
  amount,
  status,
  expiresAt,
  onCancel,
  onPay,
  isPaying,
}: BookingCardProps) {
  const isCancellable = ['pending_payment', 'payment_processing', 'confirmed'].includes(status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{tutorName}</h3>
            <Badge variant={status === 'confirmed' ? 'default' : status === 'pending_payment' ? 'secondary' : 'outline'}>
              {status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{subject}</p>
          <p className="text-sm">
            {date} | {time}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
          <span className="text-lg font-black text-brand-dark">{amount}</span>
          
          <div className="flex items-center gap-2">
            {status === 'pending_payment' && expiresAt && (
              <div className="text-xs text-destructive flex items-center gap-1 mr-2">
                Expires in: <CountdownTimer expiresAt={expiresAt} />
              </div>
            )}
            
            {status === 'pending_payment' && onPay && (
              <Button variant="default" size="sm" onClick={onPay} disabled={isPaying}>
                {isPaying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay Now
              </Button>
            )}
            
            {isCancellable && (
              <Button variant="outline" size="sm" onClick={onCancel} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
