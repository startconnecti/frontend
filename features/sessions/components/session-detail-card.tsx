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
  Star,
  GraduationCap,
  ShieldAlert,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Session } from '../types/index';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTutorDetailQuery } from '@/features/tutors/hooks/use-tutor-detail-query';
import { useCreateConversationMutation } from '@/features/messages/hooks/use-create-conversation-mutation';
import { useCompleteSessionMutation } from '../hooks/use-complete-session-mutation';
import { useState } from 'react';
import { CancelSessionModal } from './cancel-session-modal';

interface SessionDetailCardProps {
  session: Session;
}

export function SessionDetailCard({ session }: SessionDetailCardProps) {
  const router = useRouter();
  
  // Queries & Mutations
  const { data: tutor, isLoading: isLoadingTutor } = useTutorDetailQuery(session.tutorProfileId || '', true);
  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversationMutation();
  const { mutate: completeSession, isPending: isCompleting } = useCompleteSessionMutation();
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
    hour12: true 
  })} - ${endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })}`;

  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  const statusColors = {
    scheduled: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    no_show: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const isPastEndTime = new Date() > endDate;
  const showMarkAsComplete = session.status === 'scheduled' && isPastEndTime;

  const handleMessageTutor = () => {
    if (session.tutorProfileId) {
      createConversation(session.tutorProfileId, {
        onSuccess: (data) => {
          router.push(`${ROUTES.MESSAGES}?conversationId=${data.conversation.id}`);
        }
      });
    }
  };

  const handleMarkComplete = () => {
    completeSession(session.sessionId);
  };

  return (
    <>
      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-muted/10 border-b border-border/40 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-black" style={{ color: '#2C1208' }}>
            {session.subjectName}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[session.status]}`}>
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
                  <span className="font-bold capitalize">{session.meetingProvider || 'Google Meet'}</span>
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
                    <span className="text-xs text-muted-foreground font-semibold block mb-1">Amount Paid</span>
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
            {session.status === 'cancelled' && session.cancellationReason && (
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
                <Ban className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-rose-900 uppercase tracking-widest">Cancellation Reason</p>
                  <p className="text-sm text-rose-800 italic">"{session.cancellationReason}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Tutor Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border/40 bg-muted/5 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Tutor Information
              </h4>
              
              {isLoadingTutor ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : tutor ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/10">
                      <AvatarImage src={tutor.avatarUrl || undefined} alt={tutor.fullName || session.tutorName} />
                      <AvatarFallback className="text-lg bg-primary/5 text-primary font-bold">
                        {tutor.fullName ? tutor.fullName.charAt(0) : session.tutorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <h5 className="font-bold text-brand-dark leading-tight">{tutor.fullName || session.tutorName || 'Unknown Tutor'}</h5>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{(tutor.averageRating ?? 0).toFixed(1)}</span>
                        <span className="text-muted-foreground">({tutor.totalReviews ?? 0} reviews)</span>
                      </div>
                      {tutor.yearsOfExperience && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>{tutor.yearsOfExperience} years exp</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(tutor.subjects || []).slice(0, 3).map((sub: string) => (
                      <Badge key={sub} variant="secondary" className="text-[10px] font-semibold bg-primary/5 text-primary hover:bg-primary/5 border-none px-2 py-0">
                        {sub}
                      </Badge>
                    ))}
                    {(tutor.subjects || []).length > 3 && (
                      <span className="text-[10px] text-muted-foreground ml-1">+{(tutor.subjects || []).length - 3} more</span>
                    )}
                  </div>

                  {/* Bio Snapshot */}
                  {tutor.bio && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                        {tutor.bio}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold" asChild>
                      <Link href={`/tutors/${tutor.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    {(session.status === 'scheduled' || session.status === 'completed') && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full text-xs font-bold gap-2" 
                        onClick={handleMessageTutor}
                        disabled={isCreatingConversation}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {isCreatingConversation ? 'Opening...' : 'Message'}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                // Fallback if tutor detail endpoint fails or publicOnly has issues
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarFallback className="text-md bg-primary/5 text-primary font-bold">
                        {session.tutorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h5 className="font-bold text-brand-dark">{session.tutorName || 'Unknown Tutor'}</h5>
                      <span className="text-xs text-muted-foreground">Tutor Profile Details Unavailable</span>
                    </div>
                  </div>
                  
                  {(session.status === 'scheduled' || session.status === 'completed') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs font-bold gap-2 mt-2" 
                      onClick={handleMessageTutor}
                      disabled={isCreatingConversation}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {isCreatingConversation ? 'Opening Chat...' : 'Message Tutor'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Section C: Actions */}
      <CardFooter className="bg-muted/10 border-t border-border/40 p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Leave Feedback Button */}
          {session.status === 'completed' && !session.hasFeedback && (
            <Button variant="default" className="font-bold gap-2" asChild>
              <Link href={ROUTES.STUDENT.SESSION_FEEDBACK(session.sessionId)}>
                <MessageSquareQuote className="h-4 w-4" />
                Leave Feedback
              </Link>
            </Button>
          )}

          {/* Feedback Submitted Badge */}
          {session.status === 'completed' && session.hasFeedback && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="h-4 w-4" />
              Feedback Submitted
            </div>
          )}

          {/* Create Dispute Button */}
          {session.status === 'completed' && (
            <Button 
              variant="outline" 
              className="font-bold gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" 
              onClick={() => alert('Dispute flow coming soon')}
            >
              <ShieldAlert className="h-4 w-4" />
              Report Issue
            </Button>
          )}

          {/* Cancel Session Button */}
          {(session.status === 'scheduled' || session.status === 'pending_payment' || session.status === 'payment_processing' as any) && (
            <Button 
              variant="outline" 
              className="font-bold gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" 
              onClick={() => setIsCancelModalOpen(true)}
            >
              <XCircle className="h-4 w-4" />
              Cancel Session
            </Button>
          )}
        </div>

        {/* Mark as Complete Button */}
        {showMarkAsComplete && (
          <Button 
            className="font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10"
            onClick={handleMarkComplete}
            disabled={isCompleting}
          >
            <CheckCircle className="h-4 w-4" />
            {isCompleting ? 'Completing...' : 'Mark Session as Complete'}
          </Button>
        )}
      </CardFooter>
      </Card>

      <CancelSessionModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        sessionId={session.sessionId || (session as any).id} 
      />
    </>
  );
}
