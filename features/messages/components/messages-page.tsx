'use client';

import { Search } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useConversationsQuery } from '../hooks/use-conversations-query';
import { ConversationList } from './conversation-list';
import { ChatBox } from './chat-box';
import { useAuthStore } from '@/stores/auth-store';
import { Conversation } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function MessagesPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const activeId = (params.id as string) || searchParams.get('conversationId') || '';
  
  const user = useAuthStore((state) => state.user);
  const { data, isLoading: isListLoading } = useConversationsQuery();
  
  const conversations: Conversation[] = (data as any)?.items?.map((item: any) => {
    const isStudent = user?.role === 'student';
    const participant = isStudent ? item.tutor : item.student;
    
    return {
      id: item.conversationId,
      participant: {
        id: participant.id,
        fullName: participant.fullName,
        role: isStudent ? 'tutor' : 'student' as const,
      },
      lastMessage: item.latestMessage?.content,
      lastMessageAt: item.latestMessageAt || new Date().toISOString(),
      unreadCount: item.unreadCount,
    };
  }) || [];

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden">
      {/* Sidebar - List */}
      <div className={cn(
        "flex-col w-full md:w-80 lg:w-96 overflow-hidden border-r border-border/40 bg-white",
        activeId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-xl font-black text-brand-dark">Messages</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {isListLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : (
          <ConversationList conversations={conversations} activeId={activeId} />
        )}
      </div>

      {/* Main Content - ChatBox */}
      <ChatBox conversationId={activeId} />
    </div>
  );
}
