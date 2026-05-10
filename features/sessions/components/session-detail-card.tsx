'use client';

import { Calendar, Clock, Video, CreditCard, MessageCircle, Ban, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from '../types';

interface SessionDetailCardProps {
  session: Session;
}

export function SessionDetailCard({ session }: SessionDetailCardProps) {
  const startDate = new Date(session.startTime);
  const dateStr = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const statusColors = {
    scheduled: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    no_show: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <Card className="border-border/60 shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 p-6 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-black" style={{ color: '#2C1208' }}>{session.subject}</CardTitle>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[session.status]}`}>
              {session.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted-foreground font-medium">Session ID: {session.id}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Time & Meeting */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Schedule
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {dateStr}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <Clock className="h-4 w-4 text-primary" />
                  {timeStr}
                </div>
              </div>
            </div>

            {session.status === 'scheduled' && session.meetingUrl && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Video className="h-3 w-3" />
                  Meeting Link
                </h4>
                <p className="text-xs text-muted-foreground">This session will take place via {session.meetingProvider.replace('_', ' ')}.</p>
                <Button className="w-full font-bold gap-2" asChild>
                  <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                    Join Session Now
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Right: Tutor & Payment */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Avatar className="h-3 w-3" />
                Tutor Information
              </h4>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={session.tutor.avatarUrl} alt={session.tutor.fullName} />
                  <AvatarFallback>{session.tutor.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{session.tutor.fullName}</p>
                  <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary hover:underline" disabled>
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3 w-3" />
                Payment Summary
              </h4>
              <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Session Amount</span>
                  <span className="font-bold">${session.paymentSummary.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={`font-bold capitalize ${session.paymentSummary.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {session.paymentSummary.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Reason */}
        {session.status === 'cancelled' && session.cancelReason && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-900 uppercase tracking-widest">Cancellation Reason</p>
              <p className="text-sm text-rose-800 italic">"{session.cancelReason}"</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-border/40 p-6 flex flex-wrap gap-4">
        <Button variant="outline" className="font-bold gap-2" disabled>
          <MessageCircle className="h-4 w-4" />
          Message Tutor
        </Button>
        
        {session.status === 'completed' && session.feedbackStatus === 'pending' && (
          <Button variant="outline" className="font-bold gap-2" disabled>
            <MessageSquareQuote className="h-4 w-4" />
            Leave Feedback
          </Button>
        )}

        {session.status === 'scheduled' && (
          <Button variant="ghost" className="font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2 ml-auto" disabled>
            <Ban className="h-4 w-4" />
            Cancel Session
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
