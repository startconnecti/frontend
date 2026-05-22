import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
}

export function SessionCard({
  participantName,
  subject,
  startTime,
  endTime,
  date,
  status,
  avatar,
}: SessionCardProps) {
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

        <div className="flex items-center text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
