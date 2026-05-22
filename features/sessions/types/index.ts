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
  bookingId?: string;
  bookingCode?: string | null;
  studentId?: string;
  tutorProfileId?: string;
  bufferEndTime?: string | null;
  meetingProvider?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  paymentSummary?: {
    amount: number;
    status: string;
  } | null;
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
