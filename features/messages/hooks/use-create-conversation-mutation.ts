'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleMutationError } from '@/lib/api/query-utils';
import { messageService } from '../services/message-service';

export function useCreateConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tutorId: string) => messageService.createConversation(tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to initiate conversation');
    },
  });
}
