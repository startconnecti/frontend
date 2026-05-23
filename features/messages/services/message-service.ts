import { api } from '@/lib/api/client';
import { Conversation, Message } from '../types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/api/v1/conversations');
  },

  async getConversationById(id: string): Promise<Conversation> {
    return api.get<Conversation>(`/api/v1/conversations/${id}`);
  },

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/api/v1/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return api.post<Message>(`/api/v1/conversations/${conversationId}/messages`, {
      content,
    });
  },

  async createConversation(tutorId: string): Promise<{ conversation: { id: string } }> {
    return api.post<{ conversation: { id: string } }>('/api/v1/conversations', {
      tutor_id: tutorId,
    });
  },

  async markConversationAsRead(id: string): Promise<void> {
    await api.post(`/api/v1/conversations/${id}/read`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/api/v1/conversations/unread-count');
  }
};
