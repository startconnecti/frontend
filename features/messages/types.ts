export type UserRole = 'student' | 'tutor';

export interface Participant {
  id: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Conversation {
  id: string;
  participant: Participant;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
  relatedTutorId?: string;
  relatedSessionId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
  isOwnMessage: boolean;
}
