'use client';

import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeftIcon, 
  ShieldAlertIcon,
  UserIcon,
  CalendarIcon,
  PaperclipIcon,
  MessageSquareIcon,
  InfoIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { 
  useAdminConversationDetailQuery, 
  useAdminMessagesQuery
} from '@/features/admin-conversations';
import { Skeleton } from '@/components/ui/skeleton';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
      return '-';
    }
    return date.toLocaleString();
  } catch {
    return '-';
  }
}

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: conversation, isLoading: isLoadingConv, isError: isErrorConv } = useAdminConversationDetailQuery(id);
  const { data: messagesData, isLoading: isLoadingMessages } = useAdminMessagesQuery(id, { limit: 100 });
  
  const messages = messagesData?.items || [];
  const student = conversation?.participants.find(p => p.role === 'student');
  const tutor = conversation?.participants.find(p => p.role === 'tutor');

  const isLoading = isLoadingConv || isLoadingMessages;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorConv || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquareIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Conversation not found</h2>
        <p className="text-muted-foreground mt-2">The conversation might have been deleted or the ID is invalid.</p>
        <Button asChild className="mt-6">
          <Link href={ADMIN_ROUTES.CONVERSATIONS}>Back to Conversations</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.CONVERSATIONS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Conversations
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Conversation Viewer"
        description={`Monitoring session between ${student?.fullName || 'Student'} and ${tutor?.fullName || 'Tutor'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarImage src={student?.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px]">{student?.fullName?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarImage src={tutor?.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{tutor?.fullName?.charAt(0) || 'T'}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-sm">
                  <span className="font-bold">{student?.fullName || 'Student'}</span> 
                  <span className="mx-2 text-muted-foreground">and</span>
                  <span className="font-bold">{tutor?.fullName || 'Tutor'}</span>
                </div>
              </div>
              <Badge 
                variant={conversation.status === 'flagged' ? 'destructive' : 'outline'} 
                className="gap-1 capitalize"
              >
                {conversation.status === 'flagged' && <ShieldAlertIcon className="h-3 w-3" />}
                {conversation.status}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                  <MessageSquareIcon className="h-8 w-8 mb-2" />
                  <p>No messages in this conversation yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => {
                    const isTutor = msg.senderRole === 'tutor';
                    const isSystem = msg.senderRole === 'system';
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <div className="bg-muted/50 rounded-full px-4 py-1 flex items-center gap-2">
                            <InfoIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground font-medium">{msg.content}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold">{msg.senderName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <div 
                          className={`max-w-[80%] rounded-2xl p-4 text-sm relative group ${
                            isTutor 
                              ? 'bg-muted rounded-tl-none text-foreground' 
                              : 'bg-primary text-primary-foreground rounded-tr-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((file) => (
                              <a 
                                key={file.id} 
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 border rounded-lg bg-card text-xs hover:bg-muted transition-colors"
                              >
                                <PaperclipIcon className="h-3 w-3" />
                                <span>{file.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t bg-muted/10 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <InfoIcon className="h-3 w-3" />
                Administrative Read-Only View.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Participants
            </h3>
            <div className="space-y-4">
              {student && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatarUrl || undefined} />
                      <AvatarFallback>{student.fullName?.charAt(0) || 'S'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold leading-none truncate">{student.fullName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Student</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                    <Link href={ADMIN_ROUTES.USER_DETAIL(student.id)}>View Profile</Link>
                  </Button>
                </div>
              )}

              {tutor && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tutor.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{tutor.fullName?.charAt(0) || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold leading-none truncate">{tutor.fullName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Tutor</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                    <Link href={ADMIN_ROUTES.TUTOR_DETAIL(tutor.id)}>View Profile</Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Related Records
            </h3>
            <div className="text-sm space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Booking ID:</span>
                {conversation.relatedBookingId ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-medium text-xs">{conversation.relatedBookingId}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] underline" asChild>
                      <Link href={ADMIN_ROUTES.BOOKING_DETAIL(conversation.relatedBookingId)}>View</Link>
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">None linked</span>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground block mb-1">Created At:</span>
                <span className="text-xs font-medium">{formatDate(conversation.createdAt)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
