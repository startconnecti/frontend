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
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetSessionsParams {
  limit?: number;
  page?: number;
  status?: SessionStatus | 'all';
}
