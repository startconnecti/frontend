export type TutorApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface TutorDashboardStats {
  sessionsCompleted: number;
  totalEarnings: number;
}

export interface TutorEarnings {
  monthlyEarnings: number;
  pendingPayoutAmount: number;
}

export interface UpcomingTeachingSession {
  id: string;
  studentName: string;
  studentAvatar?: string;
  subject: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
}

export interface RecentReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RecentEarning {
  id: string;
  subject: string;
  amount: number;
  date: string;
}

export interface TutorDashboardData {
  tutorName: string;
  approvalStatus: TutorApprovalStatus;
  isPublic: boolean;
  stats: TutorDashboardStats;
  earnings: TutorEarnings;
  upcomingSession: UpcomingTeachingSession | null;
  recentReviews: RecentReview[];
  recentEarnings: RecentEarning[];
}
