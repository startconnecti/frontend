import { adminApi } from '@/lib/admin-api/client';
import {
  AdminConversation,
  AdminConversationListParams,
  AdminConversationListResponse,
  AdminMessage,
  AdminMessageListParams,
  AdminMessageListResponse,
} from '../types';

/**
 * Normalizes an admin conversation object with fallback values.
 */
function normalizeConversation(conv: Record<string, unknown>): AdminConversation {
  return {
    id: (conv?.id as string) || (conv?.conversationId as string) || '',
    studentId: (conv?.studentId as string) || '',
    studentName: (conv?.studentName as string) || 'Unknown Student',
    tutorProfileId: (conv?.tutorProfileId as string) || '',
    tutorName: (conv?.tutorName as string) || 'Unknown Tutor',
    status: (conv?.status as string) || 'active',
    latestMessageAt: (conv?.latestMessageAt as string | null) || null,
    createdAt: (conv?.createdAt as string) || new Date(0).toISOString(),
    updatedAt: (conv?.updatedAt as string) || new Date(0).toISOString(),
  };
}

/**
 * Normalizes an admin message object with fallback values.
 */
function normalizeMessage(msg: Record<string, unknown>): AdminMessage {
  return {
    id: (msg?.id as string) || (msg?.messageId as string) || '',
    conversationId: (msg?.conversationId as string) || '',
    senderUserId: (msg?.senderUserId as string) || '',
    senderName: (msg?.senderName as string) || 'Unknown',
    content: (msg?.content as string) || '',
    status: (msg?.status as string) || 'active',
    createdAt: (msg?.createdAt as string) || new Date(0).toISOString(),
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
    
    // Support { conversation: ... } or { data: ... } or direct conversation object
    const rawConv = (response?.conversation as Record<string, unknown>) || (response?.data as Record<string, unknown>) || response;
    return normalizeConversation(rawConv);
  },

  /**
   * List messages for a specific conversation.
   */
  async listMessages(id: string, params: AdminMessageListParams): Promise<AdminMessageListResponse> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.offset = (params.page - 1) * (params.limit || 20);
    if (params.limit) queryParams.limit = params.limit;
    
    // Pass conversationId correctly for backend endpoint GET /api/v1/admin/messages
    queryParams.conversationId = id;

    const response = await adminApi.get<unknown>(`/api/v1/admin/messages`, { params: queryParams });
    return normalizeListResponse(response, normalizeMessage, params.limit || 20);
  },
};
