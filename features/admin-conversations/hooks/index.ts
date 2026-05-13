import { useQuery } from '@tanstack/react-query';
import { adminConversationsService } from '../services/admin-conversations-service';
import { AdminConversationListParams, AdminMessageListParams } from '../types';

export const ADMIN_CONVERSATIONS_KEYS = {
  all: ['admin-conversations'] as const,
  lists: () => [...ADMIN_CONVERSATIONS_KEYS.all, 'list'] as const,
  list: (params: AdminConversationListParams) => [...ADMIN_CONVERSATIONS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_CONVERSATIONS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_CONVERSATIONS_KEYS.details(), id] as const,
  messages: (id: string, params: AdminMessageListParams) => [...ADMIN_CONVERSATIONS_KEYS.detail(id), 'messages', params] as const,
};

export function useAdminConversationsQuery(params: AdminConversationListParams) {
  return useQuery({
    queryKey: ADMIN_CONVERSATIONS_KEYS.list(params),
    queryFn: () => adminConversationsService.listConversations(params),
  });
}

export function useAdminConversationDetailQuery(id: string) {
  return useQuery({
    queryKey: ADMIN_CONVERSATIONS_KEYS.detail(id),
    queryFn: () => adminConversationsService.getConversation(id),
    enabled: !!id,
  });
}

export function useAdminMessagesQuery(id: string, params: AdminMessageListParams) {
  return useQuery({
    queryKey: ADMIN_CONVERSATIONS_KEYS.messages(id, params),
    queryFn: () => adminConversationsService.listMessages(id, params),
    enabled: !!id,
  });
}
