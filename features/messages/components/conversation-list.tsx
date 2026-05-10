'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const router = useRouter();
  const params = useParams();
  const activeId = params.id as string;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {conversations.map((conv) => {
        const isActive = activeId === conv.id;
        
        return (
          <button
            key={conv.id}
            onClick={() => router.push(`${ROUTES.STUDENT.MESSAGES}/${conv.id}`)}
            className={cn(
              "flex items-center gap-4 p-4 text-left border-b border-border/40 transition-all hover:bg-muted/50",
              isActive && "bg-primary/5 border-l-4 border-l-primary"
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12 shadow-sm">
                <AvatarImage src={conv.participant.avatarUrl} alt={conv.participant.fullName} />
                <AvatarFallback className="font-bold">
                  {conv.participant.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black truncate" style={{ color: '#2C1208' }}>
                  {conv.participant.fullName}
                </h4>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                  {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                </span>
              </div>
              <p className={cn(
                "text-xs truncate",
                conv.unreadCount > 0 ? "text-foreground font-bold" : "text-muted-foreground font-medium"
              )}>
                {conv.lastMessage || 'No messages yet'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
