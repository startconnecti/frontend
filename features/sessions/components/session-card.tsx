'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SessionStatus } from '../types/index';

interface SessionCardProps {
  id: string;
  tutorName: string;
  subjectName: string;
  date: string;
  time: string;
  status: SessionStatus;
  meetingUrl?: string;
  onCancel?: () => void;
  onFeedback?: () => void;
}

export function SessionCard({
  tutorName,
  subjectName,
  date,
  time,
  status,
  meetingUrl,
  onCancel,
  onFeedback,
}: SessionCardProps) {
  const isScheduled = status === 'scheduled';
  const isCompleted = status === 'completed' || status === 'auto_completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
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
        <div className="flex flex-col items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            {isScheduled && meetingUrl && (
              <Button asChild size="sm">
                <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
                  Join Class
                </a>
              </Button>
            )}
            
            {isScheduled && onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                Cancel Session
              </Button>
            )}

            {isCompleted && onFeedback && (
              <Button variant="outline" size="sm" onClick={onFeedback}>
                Leave Feedback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
