export type AdminSessionStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'pending_payment' | 'no_show' | 'expired' | 'pending';

export interface AdminSessionListItem {
  id: string;
  sessionId: string;
  sessionCode: string;
  bookingId: string;
  bookingCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  subjectName: string;
  price?: number;
  startTime: string;
  endTime: string;
  status: AdminSessionStatus;
  meetingUrl?: string | null;
  recordingUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminSessionsQueryParams {
  keyword?: string;
  status?: AdminSessionStatus;
  page?: number;
  limit?: number;
}

export interface AdminSessionsListResponse {
  items: AdminSessionListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}
