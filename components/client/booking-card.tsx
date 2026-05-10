import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientStatusBadge, AllStatuses } from '@/components/shared/client-status-badge';
import Link from 'next/link';

interface BookingCardProps {
  id: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  status: AllStatuses;
  amount: number;
  avatar?: string;
  onCancel?: () => void;
  onViewDetails?: () => void;
}

export function BookingCard({
  id,
  tutorName,
  subject,
  date,
  time,
  status,
  amount,
  avatar,
  onCancel,
  onViewDetails
}: BookingCardProps) {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="bg-muted/30 p-4 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{date}</span>
          <span className="text-muted-foreground mx-1">•</span>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{time}</span>
        </div>
        <ClientStatusBadge status={status} />
      </CardHeader>

      <CardContent className="p-4 flex gap-4 items-center">
        <Avatar className="h-12 w-12 border border-border/40">
          <AvatarImage src={avatar} alt={tutorName} />
          <AvatarFallback className="bg-primary/5 text-primary">
            {tutorName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-bold">{tutorName}</h4>
          <p className="text-sm text-muted-foreground">{subject}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">${amount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
        {status === 'confirmed' && (
          <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
