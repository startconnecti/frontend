'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/message-service';
import { toast } from 'sonner';

interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: SendMessageRequest) => 
      messageService.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversation-detail', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}
