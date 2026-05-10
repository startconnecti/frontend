'use client';

import { Message, Participant } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

interface ConversationThreadProps {
  messages: Message[];
  participant: Participant;
}

export function ConversationThread({ messages, participant }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6]">
      {messages.map((msg, index) => {
        const isOwn = msg.isOwnMessage;
        const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);
        
        return (
          <div 
            key={msg.id} 
            className={cn(
              "flex items-end gap-3",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            {!isOwn && (
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
              isOwn ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm",
                isOwn 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-white text-foreground border border-border/40 rounded-bl-none"
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
