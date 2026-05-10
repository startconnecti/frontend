import { Conversation, Message } from '../types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let conversationStorage = [...MOCK_CONVERSATIONS];
let messageStorage = { ...MOCK_MESSAGES };

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return [...conversationStorage];
  },

  async getConversationById(id: string): Promise<Conversation | null> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return conversationStorage.find(c => c.id === id) || null;
  },

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return messageStorage[conversationId] || [];
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      senderName: 'Me',
      senderRole: 'student', // Mock assumption
      content,
      createdAt: new Date().toISOString(),
      isOwnMessage: true,
    };
    
    if (!messageStorage[conversationId]) {
      messageStorage[conversationId] = [];
    }
    messageStorage[conversationId].push(newMessage);
    
    // Update last message in conversation
    const convIndex = conversationStorage.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversationStorage[convIndex] = {
        ...conversationStorage[convIndex],
        lastMessage: content,
        lastMessageAt: newMessage.createdAt,
      };
    }
    
    return newMessage;
  }
};
