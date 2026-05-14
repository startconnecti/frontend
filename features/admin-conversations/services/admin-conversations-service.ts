import { adminApi } from '@/lib/admin-api/client';
import {
  AdminConversation,
  AdminConversationListParams,
  AdminConversationListResponse,
  AdminMessage,
  AdminMessageListParams,
  AdminMessageListResponse,
  AdminParticipant,
  AdminAttachment
} from '../types';

/**
 * Normalizes an admin conversation object with fallback values.
 */
function normalizeConversation(conv: Record<string, unknown>): AdminConversation {
  const rawParticipants = Array.isArray(conv?.participants) ? conv.participants : [];
  const lastMessage = conv?.lastMessage as Record<string, unknown> | null | undefined;
  
  return {
    id: (conv?.id as string) || (conv?.conversationId as string) || '',
    participants: rawParticipants.map((p: unknown): AdminParticipant => {
      const participant = p as Record<string, unknown>;
      return {
        id: (participant?.id as string) || (participant?.userId as string) || '',
        fullName: (participant?.fullName as string) || (participant?.name as string) || 'Unknown',
        email: (participant?.email as string) || '',
        role: (participant?.role as 'student' | 'tutor') || 'student',
        avatarUrl: (participant?.avatarUrl as string | null) || null,
      };
    }),
    lastMessage: lastMessage
      ? {
          content: (lastMessage?.content as string) || '',
          senderId: (lastMessage?.senderId as string) || '',
          createdAt: (lastMessage?.createdAt as string) || new Date(0).toISOString(),
        }
      : null,
    unreadCount: typeof conv?.unreadCount === 'number' ? conv.unreadCount : 0,
    status: (conv?.status as AdminConversation['status']) || 'active',
    lastActivityAt: (conv?.lastActivityAt as string) || (conv?.updatedAt as string) || new Date(0).toISOString(),
    relatedBookingId: (conv?.relatedBookingId as string) || null,
    relatedSessionId: (conv?.relatedSessionId as string) || null,
    createdAt: (conv?.createdAt as string) || new Date(0).toISOString(),
    updatedAt: (conv?.updatedAt as string) || new Date(0).toISOString(),
  };
}

/**
 * Normalizes an admin message object with fallback values.
 */
function normalizeMessage(msg: Record<string, unknown>): AdminMessage {
  const sender = msg?.sender as Record<string, unknown> | null | undefined;
  const rawAttachments = Array.isArray(msg?.attachments) ? msg.attachments : [];

  return {
    id: (msg?.id as string) || (msg?.messageId as string) || '',
    conversationId: (msg?.conversationId as string) || '',
    senderId: (msg?.senderId as string) || '',
    senderName: (msg?.senderName as string) || (sender?.fullName as string) || 'Unknown',
    senderRole: (msg?.senderRole as AdminMessage['senderRole']) || (sender?.role as AdminMessage['senderRole']) || 'system',
    content: (msg?.content as string) || '',
    attachments: rawAttachments.map((a: unknown): AdminAttachment => {
      const attachment = a as Record<string, unknown>;
      return {
        id: (attachment?.id as string) || '',
        name: (attachment?.name as string) || 'File',
        url: (attachment?.url as string) || '',
        size: attachment?.size as number,
        mimeType: attachment?.mimeType as string,
      };
    }),
    createdAt: (msg?.createdAt as string) || new Date(0).toISOString(),
    deletedAt: (msg?.deletedAt as string | null) || null,
  };
}

/**
 * Normalizes list responses that might be wrapped in different ways.
 */
function normalizeListResponse<T>(
  response: unknown,
  normalizer: (item: Record<string, unknown>) => T,
  defaultLimit = 10
): { items: T[]; total: number; page: number; limit: number; totalPages: number } {
  const res = response as Record<string, unknown> | null;
  let rawItems: Record<string, unknown>[] = [];
  let total = 0;
  let page = 1;
  let limit = defaultLimit;

  if (!res) {
    // Return empty state if response is null/undefined
  } else if (Array.isArray(res)) {
    rawItems = res as Record<string, unknown>[];
    total = rawItems.length;
  } else {
    // Extract data payload if enveloped
    const dataPayload = res.data && typeof res.data === 'object' ? (res.data as Record<string, unknown>) : res;
    
    if (Array.isArray(dataPayload.items)) {
      rawItems = dataPayload.items as Record<string, unknown>[];
    } else if (Array.isArray(dataPayload)) {
      rawItems = dataPayload as Record<string, unknown>[];
    } else if (Array.isArray(res.items)) {
      rawItems = res.items as Record<string, unknown>[];
    }

    total = Number(dataPayload.total ?? res.total ?? rawItems.length) || rawItems.length;
    page = Number(dataPayload.page ?? res.page ?? 1) || 1;
    limit = Number(dataPayload.limit ?? res.limit ?? defaultLimit) || defaultLimit;
  }

  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);

  return {
    items: rawItems.map((item) => {
      try {
        return normalizer(item);
      } catch (e) {
        return null as unknown as T;
      }
    }).filter(Boolean),
    total,
    page,
    limit,
    totalPages,
  };
}

export const adminConversationsService = {
  /**
   * List conversations with filters and pagination.
   */
  async listConversations(params: AdminConversationListParams): Promise<AdminConversationListResponse> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.offset = (params.page - 1) * (params.limit || 10);
    if (params.limit) queryParams.limit = params.limit;
    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.status && params.status !== 'all') queryParams.status = params.status;

    const response = await adminApi.get<unknown>('/api/v1/admin/conversations', { params: queryParams });
    return normalizeListResponse(response, normalizeConversation, params.limit);
  },

  /**
   * Get a single conversation detail.
   */
  async getConversation(id: string): Promise<AdminConversation> {
    const response = await adminApi.get<Record<string, unknown>>(`/api/v1/admin/conversations/${id}`);
    
    // Support { data: conversation } or direct conversation object
    const rawConv = (response?.data as Record<string, unknown>) || response;
    return normalizeConversation(rawConv);
  },

  /**
   * List messages for a specific conversation.
   */
  async listMessages(id: string, params: AdminMessageListParams): Promise<AdminMessageListResponse> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.offset = (params.page - 1) * (params.limit || 20);
    if (params.limit) queryParams.limit = params.limit;

    const response = await adminApi.get<unknown>(`/api/v1/admin/conversations/${id}/messages`, { params: queryParams });
    return normalizeListResponse(response, normalizeMessage, params.limit || 20);
  },
};
