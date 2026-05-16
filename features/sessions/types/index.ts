export type SessionStatus = 'scheduled' | 'cancelled' | 'completed' | 'no_show';

export interface Session {
  sessionId: string;
  tutorName: string;
  subjectName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: SessionStatus;
  meetingUrl?: string;
  hasFeedback: boolean;
  studentName?: string;
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
