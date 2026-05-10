import { Video, Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientStatusBadge, AllStatuses } from '@/components/shared/client-status-badge';

interface SessionCardProps {
  id: string;
  participantName: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  status: AllStatuses;
  avatar?: string;
  joinUrl?: string;
  onJoin?: () => void;
  onReschedule?: () => void;
}

export function SessionCard({
  id,
  participantName,
  subject,
  startTime,
  endTime,
  date,
  status,
  avatar,
  joinUrl,
  onJoin,
  onReschedule
}: SessionCardProps) {
  const isUpcoming = status === 'scheduled';

  return (
    <Card className="border-l-4 border-l-primary overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex flex-col gap-1 sm:w-32 shrink-0">
          <p className="text-sm font-semibold text-primary uppercase tracking-tighter">{date}</p>
          <p className="text-lg font-bold">{startTime}</p>
          <p className="text-xs text-muted-foreground">to {endTime}</p>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" />

        <div className="flex flex-1 items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">{participantName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-bold truncate">{participantName}</h4>
              <ClientStatusBadge status={status} className="text-[10px] h-5" />
            </div>
            <p className="text-sm text-muted-foreground truncate">{subject}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {isUpcoming && (
            <Button size="sm" className="gap-2" onClick={onJoin}>
              <Video className="h-4 w-4" />
              Join Session
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onReschedule}>
            Reschedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
