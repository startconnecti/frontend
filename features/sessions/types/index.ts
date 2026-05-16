export type SessionStatus = 'scheduled' | 'completed' | 'student_canceled' | 'tutor_canceled' | 'admin_canceled' | 'auto_completed';

export interface Session {
  id: string;
  tutorName: string;
  subjectName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: SessionStatus;
  meetingUrl?: string;
}

export interface SessionListResponse {
  items: Session[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface GetSessionsParams {
  limit?: number;
  offset?: number;
  status?: SessionStatus | 'all';
}
