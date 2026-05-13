export interface AdminParticipant {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'tutor';
  avatarUrl?: string | null;
}

export interface AdminMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'tutor' | 'system';
  content: string;
  attachments: AdminAttachment[];
  createdAt: string;
  deletedAt?: string | null;
}

export interface AdminAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface AdminConversation {
  id: string;
  participants: AdminParticipant[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  status: 'active' | 'archived' | 'flagged' | 'closed';
  lastActivityAt: string;
  relatedBookingId?: string | null;
  relatedSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminConversationListParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
}

export interface AdminConversationListResponse {
  items: AdminConversation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminMessageListParams {
  page?: number;
  limit?: number;
}

export interface AdminMessageListResponse {
  items: AdminMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
