export type SessionStatus = 'scheduled' | 'cancelled' | 'completed' | 'no_show';

export interface SessionTutor {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface SessionStudent {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface SessionPaymentSummary {
  amount: number;
  status: 'paid' | 'refunded' | 'pending';
  transactionId: string;
}

export interface Session {
  id: string;
  bookingId: string;
  studentId: string;
  student?: SessionStudent;
  tutor: SessionTutor;
  subject: string;
  startTime: string;
  endTime: string;
  meetingProvider: 'zoom' | 'google_meet';
  meetingUrl?: string;
  status: SessionStatus;
  paymentSummary: SessionPaymentSummary;
  feedbackStatus: 'pending' | 'submitted' | 'not_applicable';
  cancelReason?: string;
}

export interface SessionFilters {
  status?: SessionStatus | 'all';
  startDate?: string;
  endDate?: string;
}
