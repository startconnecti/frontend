'use client';

import { MessageCircle, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useConversationDetailQuery } from '../hooks/use-conversation-detail-query';
import { useSendMessageMutation } from '../hooks/use-send-message-mutation';
import { useAuthStore } from '@/stores/auth-store';
import { ConversationThread } from './conversation-thread';
import { MessageComposer } from './message-composer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';

interface ChatBoxProps {
  conversationId?: string;
}

export function ChatBox({ conversationId }: ChatBoxProps) {
  const router = useRouter();
  const { data: detail, isLoading: isDetailLoading } = useConversationDetailQuery(conversationId || '');
  const sendMutation = useSendMessageMutation();
  const user = useAuthStore((state) => state.user);

  const conversationData = (detail?.conversation as any)?.conversation;
  const isStudent = user?.role === 'student';
  const participant = conversationData 
    ? {
        id: isStudent ? conversationData.tutor.id : conversationData.student.id,
        fullName: isStudent ? conversationData.tutor.fullName : conversationData.student.fullName,
        role: isStudent ? 'tutor' : 'student' as const,
        avatarUrl: undefined,
      }
    : null;

  const handleSend = (content: string) => {
    if (conversationId) {
      sendMutation.mutate({ conversationId, content });
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/5 text-center space-y-6 max-w-sm px-8 mx-auto">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
          <MessageCircle className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-brand-dark">Select a conversation</h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Connect with your tutors and students to discuss sessions, share feedback, and stay updated.
          </p>
        </div>
        <Button className="font-bold rounded-xl px-8" asChild>
          <a href={ROUTES.DISCOVER}>Start Learning</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Thread Header */}
      {detail?.conversation ? (
        <div className="p-4 border-b border-border/40 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => router.push(ROUTES.MESSAGES)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={participant?.avatarUrl} alt={participant?.fullName || 'User'} />
              <AvatarFallback className="font-bold">
                {participant?.fullName?.split(' ').map((n: string) => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <h3 className="text-sm font-black leading-none text-brand-dark">
                {participant?.fullName || 'User'}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-border/40">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
      )}

      {/* Thread Body */}
      {isDetailLoading ? (
        <div className="flex-1 p-6 space-y-6 bg-muted/5">
          <Skeleton className="h-20 w-1/2 rounded-2xl ml-auto" />
          <Skeleton className="h-20 w-1/2 rounded-2xl mr-auto" />
        </div>
      ) : detail ? (
        <ConversationThread 
          messages={(detail.messages as any)?.items || []} 
          participant={participant || { id: '', fullName: 'User', role: 'student' }} 
        />
      ) : null}

      {/* Thread Footer */}
      <MessageComposer onSend={handleSend} isSending={sendMutation.isPending} />
    </div>
  );
}
