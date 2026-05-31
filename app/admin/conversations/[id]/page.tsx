'use client';

import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ChevronLeftIcon, 
  UserIcon,
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
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';

function formatHumanReadableDate(dateString: string | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) return '-';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (isToday) return `Today ${timeString}`;
    if (isYesterday) return `Yesterday ${timeString}`;

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}

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
  // Using limit 100 as specified
  const { data: messagesData, isLoading: isLoadingMessages } = useAdminMessagesQuery(id, { limit: 100 });
  
  const messages = messagesData?.items || [];

  const isLoading = isLoadingConv || isLoadingMessages;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-[500px] md:h-[650px] w-full" />
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
        description={`Monitoring conversation between ${conversation.studentName} and ${conversation.tutorName}`}
      />

      {/* Header Info Card */}
      <Card className="mb-6 p-4 border bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Conversation ID</div>
            <div className="font-mono text-sm">{conversation.id.substring(0, 8)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <AdminStatusBadge status={conversation.status} type="user" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Created At</div>
            <div className="text-sm">{formatDate(conversation.createdAt)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Latest Activity</div>
            <div className="text-sm">{formatHumanReadableDate(conversation.latestMessageAt)}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="flex flex-col h-[500px] md:h-[650px] border overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                      {conversation.studentName?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                      {conversation.tutorName?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-sm">
                  <span className="font-bold">{conversation.studentName}</span> 
                  <span className="mx-2 text-muted-foreground">and</span>
                  <span className="font-bold">{conversation.tutorName}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                  <MessageSquareIcon className="h-8 w-8 mb-2" />
                  <p>No messages found.</p>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col-reverse">
                  {/* flex-col-reverse because messages often come sorted desc and we want chronological flow, 
                      or just reverse the array if needed. Assuming the array is newest first from the backend.
                      Let's reverse it to display oldest top, newest bottom. */}
                  {[...messages].reverse().map((msg) => {
                    // Decide side based on role. We can check if senderUserId == tutorProfileId but backend returns senderUserId 
                    // and tutorProfileId isn't the user ID. But we can just use name heuristic or alternate.
                    // Actually, let's just make the tutor on the right and student on the left.
                    const isTutor = msg.senderName === conversation.tutorName;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${isTutor ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold">{msg.senderName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatHumanReadableDate(msg.createdAt)}
                          </span>
                        </div>
                        <div 
                          className={`max-w-[80%] rounded-2xl p-4 text-sm relative group break-words whitespace-pre-wrap ${
                            isTutor 
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted rounded-tl-none text-foreground'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-muted/10 text-center shrink-0">
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
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{conversation.studentName?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold leading-none truncate">{conversation.studentName}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Student</p>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mb-2 truncate">ID: {conversation.studentId}</div>
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                  <Link href={ADMIN_ROUTES.USER_DETAIL(conversation.studentId)}>View Profile</Link>
                </Button>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">{conversation.tutorName?.charAt(0) || 'T'}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold leading-none truncate">{conversation.tutorName}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Tutor</p>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mb-2 truncate">Profile ID: {conversation.tutorProfileId}</div>
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                  <Link href={ADMIN_ROUTES.TUTOR_DETAIL(conversation.tutorProfileId)}>View Profile</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
