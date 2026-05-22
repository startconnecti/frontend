import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SessionStatus } from '../types/index';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SessionCardProps {
  id: string;
  tutorName: string;
  subjectName: string;
  date: string;
  time: string;
  status: SessionStatus;
}

export function SessionCard({
  id,
  tutorName,
  subjectName,
  date,
  time,
  status,
}: SessionCardProps) {
  const isScheduled = status === 'scheduled';
  const isCompleted = status === 'completed' || status === 'auto_completed';

  return (
    <Link href={`/student/sessions/${id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{tutorName}</h3>
              <Badge variant={isScheduled ? 'default' : isCompleted ? 'secondary' : 'outline'}>
                {status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{subjectName}</p>
            <p className="text-sm">
              {date} | {time}
            </p>
          </div>
          <div className="flex items-center text-muted-foreground">
            <ChevronRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
