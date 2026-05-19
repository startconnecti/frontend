'use client';

import { Message, Participant } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface ConversationThreadProps {
  messages: Message[];
  participant: Participant;
}

export function ConversationThread({ messages, participant }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = useAuthStore(s => s.user?.id || s.user?.userId);

  // Deduplicate messages with a robust key
  const uniqueMessages = Array.from(
    new Map(
      messages.map((m: any, index) => [m.messageId || m.id || m.tempId || index, m])
    ).values()
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [uniqueMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6]">
      {uniqueMessages.map((msg: any, index) => {
        const senderId = msg.senderUserId || msg.senderId;
        const isMine = senderId === currentUserId;
        const prevSenderId = index > 0 ? (uniqueMessages[index - 1] as any).senderUserId || (uniqueMessages[index - 1] as any).senderId : null;
        const showAvatar = !isMine && (index === 0 || prevSenderId !== senderId);
        
        return (
          <div 
            key={msg.messageId || msg.id || msg.tempId || index} 
            className={cn(
              "flex items-end gap-3",
              isMine ? "justify-end" : "justify-start"
            )}
          >
            {!isMine && (
              <div className="w-8 shrink-0">
                {showAvatar ? (
                  <Avatar className="h-8 w-8 shadow-sm">
                    <AvatarImage src={participant.avatarUrl} alt={participant.fullName} />
                    <AvatarFallback className="text-[10px] font-bold">
                      {participant.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
              </div>
            )}
            
            <div className={cn(
              "flex flex-col max-w-[75%] gap-1",
              isMine ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm",
                isMine 
                  ? "bg-primary text-white rounded-br-none" 
                  : "bg-muted/20 text-brand-dark rounded-bl-none"
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground font-bold px-1">
                {format(new Date(msg.createdAt), 'p')}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
