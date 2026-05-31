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
  senderUserId: string;
  senderName: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface AdminConversation {
  id: string;
  studentId: string;
  studentName: string;
  tutorProfileId: string;
  tutorName: string;
  status: string;
  latestMessageAt: string | null;
  createdAt: string;
  updatedAt?: string;
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
