'use client';

import { 
  Calendar, 
  Clock, 
  Video, 
  CreditCard, 
  MessageCircle, 
  Ban, 
  MessageSquareQuote,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from '../types/index';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateConversationMutation } from '@/features/messages/hooks/use-create-conversation-mutation';
import { useState } from 'react';
import { CancelSessionModal } from './cancel-session-modal';

interface TutorSessionDetailCardProps {
  session: Session;
}

export function TutorSessionDetailCard({ session }: TutorSessionDetailCardProps) {
  const router = useRouter();
  
  // Queries & Mutations
  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversationMutation();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Date Parsing
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  const dateStr = startDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const timeStr = `${startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: false 
  })} - ${endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: false 
  })}`;

  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  const statusColors = {
    scheduled: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    no_show: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const handleMessageStudent = () => {
    if (session.studentId) {
      createConversation(session.studentId, {
        onSuccess: (data) => {
          router.push(`${ROUTES.MESSAGES}?conversationId=${data.conversation.id}`);
        }
      });
    }
  };

  return (
    <>
      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-muted/10 border-b border-border/40 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black" style={{ color: '#2C1208' }}>
              {session.subjectName || session.subject || 'Standard Session'}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[session.status as keyof typeof statusColors] || statusColors.scheduled}`}>
                {session.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Session Code: #{session.sessionId.slice(-6).toUpperCase()}
              </span>
              {session.bookingCode && (
                <span className="text-xs text-muted-foreground font-medium">
                  Booking Reference: #{session.bookingCode}
                </span>
              )}
            </div>
          </div>
          
          {session.status === 'scheduled' && session.meetingUrl && (
            <Button className="font-bold gap-2" asChild>
              <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4" />
                Join Meeting
              </a>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-8 md:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Section A: Session Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Schedule Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border/40 bg-muted/5">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">Date</p>
                    <p className="text-sm font-bold text-brand-dark">{dateStr}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold">Time & Duration</p>
                    <p className="text-sm font-bold text-brand-dark">{timeStr} ({durationMinutes} mins)</p>
                  </div>
                  {session.completedAt && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold">Completed At</p>
                      <p className="text-sm font-bold text-emerald-700">
                        {new Date(session.completedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {session.cancelledAt && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold">Cancelled At</p>
                      <p className="text-sm font-bold text-rose-700">
                        {new Date(session.cancelledAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Video className="h-3 w-3" />
                  Meeting Info
                </h4>
                <div className="p-5 rounded-2xl border border-border/40 bg-muted/5 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Platform</span>
                    <span className="font-bold capitalize">{session.meetingProvider?.replace('_', ' ') || 'The specified platform'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-bold text-brand-dark">
                      {session.meetingUrl ? 'Link Available' : 'Link Pending'}
                    </span>
                  </div>
                  {session.meetingUrl && (
                    <div className="pt-2">
                      <a 
                        href={session.meetingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-bold break-all"
                      >
                        {session.meetingUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              {session.paymentSummary && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    Payment Summary
                  </h4>
                  <div className="p-5 rounded-2xl border border-border/40 bg-muted/5 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold block mb-1">Session Amount</span>
                      <span className="font-black text-lg text-primary">
                        {session.paymentSummary.amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-semibold block mb-1">Status</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        session.paymentSummary.status === 'success' || session.paymentSummary.status === 'completed' || session.paymentSummary.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {session.paymentSummary.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Reason */}
              {session.status === 'cancelled' && (session.cancellationReason || session.cancelReason) && (
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
                  <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-rose-900 uppercase tracking-widest">Cancellation Reason</p>
                    <p className="text-sm text-rose-800 italic">"{session.cancellationReason || session.cancelReason}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section B: Student Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-border/40 bg-muted/5 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Student Information
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/10">
                      <AvatarImage src={session.student?.avatarUrl} alt={session.studentName || session.student?.fullName || 'Student'} />
                      <AvatarFallback className="text-lg bg-primary/5 text-primary font-bold">
                        {(session.studentName || session.student?.fullName || 'S').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <h5 className="font-bold text-brand-dark leading-tight">{session.studentName || session.student?.fullName || 'Unknown Student'}</h5>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {(session.status === 'scheduled' || session.status === 'completed' || session.status === 'pending_payment') && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full text-xs font-bold gap-2" 
                        onClick={handleMessageStudent}
                        disabled={isCreatingConversation || !session.studentId}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {isCreatingConversation ? 'Opening...' : 'Message Student'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Section C: Actions */}
        <CardFooter className="bg-muted/10 border-t border-border/40 p-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Action buttons could go here */}
          </div>

          {/* Cancel Session Button */}
          {(session.status === 'scheduled' || session.status === 'pending_payment') && (
            <Button 
              variant="outline" 
              className="font-bold gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" 
              onClick={() => setIsCancelModalOpen(true)}
            >
              <XCircle className="h-4 w-4" />
              Cancel Session
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <CancelSessionModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        sessionId={session.sessionId || session.id} 
      />
    </>
  );
}
