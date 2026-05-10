'use client';

import { Calendar, Clock, Video, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UpcomingSession } from '../types';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

interface StudentUpcomingSessionCardProps {
  session: UpcomingSession | null;
}

export function StudentUpcomingSessionCard({ session }: StudentUpcomingSessionCardProps) {
  if (!session) {
    return (
      <Card className="border-border/60 shadow-sm border-dashed bg-muted/5 flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg mb-2">No upcoming sessions</CardTitle>
        <p className="text-sm text-muted-foreground max-w-[240px] mb-6">
          Ready to learn? Find a tutor and book your next session.
        </p>
        <Button asChild>
          <Link href={ROUTES.DISCOVER}>Browse Tutors</Link>
        </Button>
      </Card>
    );
  }

  const startDate = new Date(session.startTime);
  const dateStr = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <Card className="border-primary/20 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <Clock className="h-3.5 w-3.5" />
          Up Next
        </div>
        <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
          Confirmed
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={session.tutorAvatar} alt={session.tutorName} />
              <AvatarFallback>{session.tutorName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-bold" style={{ color: '#2C1208' }}>{session.subject}</h3>
              <p className="text-sm text-muted-foreground font-medium">with {session.tutorName}</p>
            </div>
          </div>
          
          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center gap-3 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              {dateStr}
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              {timeStr}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 p-6 flex flex-col sm:flex-row gap-3">
        {session.meetingLink && (
          <Button className="flex-1 font-bold gap-2" asChild>
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4" />
              Join Meeting
            </a>
          </Button>
        )}
        <Button variant="outline" className="flex-1 font-bold gap-2" asChild>
          <Link href={ROUTES.STUDENT.SESSIONS}>
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
