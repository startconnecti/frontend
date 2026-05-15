import { Tutor } from '@/features/tutors/types';

export interface StudentDashboardStats {
  sessionsCompleted: number;
  favoriteTutorsCount: number;
}

export interface UpcomingSession {
  id: string;
  tutorName: string;
  tutorAvatar?: string;
  subject: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
}

export interface RecentPayment {
  id: string;
  tutorName: string;
  subject: string;
  amount: number;
  status: 'confirmed';
  date: string;
}

export interface StudentDashboardData {
  studentName: string;
  stats: StudentDashboardStats;
  upcomingSession: UpcomingSession | null;
  recentPayments: RecentPayment[];
  recommendedTutors: Tutor[];
}
