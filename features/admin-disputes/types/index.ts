export type AdminDisputeStatus = 'open' | 'under_review' | 'resolved' | 'rejected' | 'cancelled';
export type AdminDisputePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminDisputeListItem {
  id: string;
  bookingId: string;
  sessionId: string | null;
  studentId: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  subject: string;
  description: string;
  status: AdminDisputeStatus;
  priority: AdminDisputePriority;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  updatedAt: string | null;
}

export interface AdminDisputeListResponse {
  items: AdminDisputeListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminDisputeListQueryParams {
  keyword?: string;
  status?: AdminDisputeStatus;
  priority?: AdminDisputePriority;
  page?: number;
  limit?: number;
}
