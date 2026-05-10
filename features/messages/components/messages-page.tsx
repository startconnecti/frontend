'use client';

import { MessageCircle, Search, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useConversationsQuery } from '../hooks/use-conversations-query';
import { useConversationDetailQuery } from '../hooks/use-conversation-detail-query';
import { useSendMessageMutation } from '../hooks/use-send-message-mutation';
import { ConversationList } from './conversation-list';
import { ConversationThread } from './conversation-thread';
import { MessageComposer } from './message-composer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function MessagesPage() {
  const router = useRouter();
  const params = useParams();
  const activeId = params.id as string;
  
  const { data: conversations = [], isLoading: isListLoading } = useConversationsQuery();
  const { data: detail, isLoading: isDetailLoading } = useConversationDetailQuery(activeId);
  const sendMutation = useSendMessageMutation();

  const handleSend = (content: string) => {
    if (activeId) {
      sendMutation.mutate({ conversationId: activeId, content });
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 p-4 md:p-8">
      {/* Sidebar - List */}
      <Card className={cn(
        "flex-col w-full md:w-80 lg:w-96 overflow-hidden border-border/60 shadow-xl shadow-primary/5 rounded-3xl bg-white",
        activeId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-xl font-black" style={{ color: '#2C1208' }}>Messages</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {isListLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : (
          <ConversationList conversations={conversations} />
        )}
      </Card>

      {/* Main Content - Thread */}
      <Card className={cn(
        "flex-1 flex flex-col overflow-hidden border-border/60 shadow-xl shadow-primary/5 rounded-3xl bg-white",
        !activeId ? "hidden md:flex items-center justify-center bg-muted/5" : "flex"
      )}>
        {activeId ? (
          <>
            {/* Thread Header */}
            {detail?.conversation ? (
              <div className="p-4 border-b border-border/40 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => router.push(ROUTES.STUDENT.MESSAGES)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={detail.conversation.participant.avatarUrl} alt={detail.conversation.participant.fullName} />
                    <AvatarFallback className="font-bold">
                      {detail.conversation.participant.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black leading-none" style={{ color: '#2C1208' }}>
                      {detail.conversation.participant.fullName}
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
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
                messages={detail.messages} 
                participant={detail.conversation!.participant} 
              />
            ) : null}

            {/* Thread Footer */}
            <MessageComposer onSend={handleSend} isSending={sendMutation.isPending} />
          </>
        ) : (
          <div className="text-center space-y-6 max-w-sm px-8">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black" style={{ color: '#2C1208' }}>Select a conversation</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Connect with your tutors and students to discuss sessions, share feedback, and stay updated.
              </p>
            </div>
            <Button className="font-bold rounded-xl px-8" asChild>
              <a href={ROUTES.DISCOVER}>Start Learning</a>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
