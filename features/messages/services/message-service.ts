import { api } from '@/lib/api/client';
import { Conversation, Message } from '../types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/api/v1/messages/conversations');
  },

  async getConversationById(id: string): Promise<Conversation> {
    return api.get<Conversation>(`/api/v1/messages/conversations/${id}`);
  },

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    // Assuming the detail endpoint returns the thread or we use a nested path
    // For this phase, we map it to the conversation detail
    return api.get<Message[]>(`/api/v1/messages/conversations/${conversationId}`);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return api.post<Message>('/api/v1/messages', {
      conversationId,
      content,
    });
  }
};
