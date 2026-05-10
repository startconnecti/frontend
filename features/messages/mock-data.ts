import { Conversation, Message } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    participant: {
      id: 'tutor-001',
      fullName: 'Dr. Sarah Wilson',
      avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
      role: 'tutor',
    },
    lastMessage: 'Looking forward to our physics session tomorrow!',
    lastMessageAt: '2024-05-10T10:30:00Z',
    unreadCount: 1,
    relatedTutorId: 'tutor-001',
    relatedSessionId: 'sess-001',
  },
  {
    id: 'conv-002',
    participant: {
      id: 'tutor-002',
      fullName: 'James Miller',
      avatarUrl: 'https://i.pravatar.cc/150?u=james',
      role: 'tutor',
    },
    lastMessage: 'Got it, let me check the calculus problem again.',
    lastMessageAt: '2024-05-09T15:45:00Z',
    unreadCount: 0,
    relatedTutorId: 'tutor-002',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-001',
      conversationId: 'conv-001',
      senderId: 'student-001',
      senderName: 'Alex Johnson',
      senderRole: 'student',
      content: 'Hi Dr. Sarah, I have some questions about quantum mechanics.',
      createdAt: '2024-05-10T10:00:00Z',
      isOwnMessage: true,
    },
    {
      id: 'msg-002',
      conversationId: 'conv-001',
      senderId: 'tutor-001',
      senderName: 'Dr. Sarah Wilson',
      senderRole: 'tutor',
      content: 'Looking forward to our physics session tomorrow!',
      createdAt: '2024-05-10T10:30:00Z',
      isOwnMessage: false,
    },
  ],
  'conv-002': [
    {
      id: 'msg-003',
      conversationId: 'conv-002',
      senderId: 'tutor-002',
      senderName: 'James Miller',
      senderRole: 'tutor',
      content: 'Got it, let me check the calculus problem again.',
      createdAt: '2024-05-09T15:45:00Z',
      isOwnMessage: false,
    },
  ],
};
