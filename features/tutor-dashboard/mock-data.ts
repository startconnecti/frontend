import { TutorDashboardData } from './types';

export const MOCK_TUTOR_DASHBOARD_DATA: TutorDashboardData = {
  tutorName: 'Dr. Sarah Wilson',
  approvalStatus: 'approved',
  isPublic: true,
  stats: {
    totalSessions: 42,
    completedSessions: 38,
    averageRating: 4.9,
    reviewCount: 24,
  },
  earnings: {
    monthlyEarnings: 1250,
    pendingPayoutAmount: 450,
  },
  upcomingSession: {
    id: 'sess-456',
    studentName: 'Alex Johnson',
    studentAvatar: 'https://i.pravatar.cc/150?u=alex',
    subject: 'Advanced Physics',
    startTime: '2024-05-15T14:00:00Z',
    endTime: '2024-05-15T15:00:00Z',
    meetingLink: 'https://zoom.us/j/123456789',
  },
  recentReviews: [
    {
      id: 'rev-1',
      studentName: 'Emily Davis',
      rating: 5,
      comment: 'Sarah is an amazing teacher! She explained complex concepts very clearly.',
      date: '2024-05-10T10:00:00Z',
    },
    {
      id: 'rev-2',
      studentName: 'Mark Thompson',
      rating: 4,
      comment: 'Great session, very helpful for my exam prep.',
      date: '2024-05-08T15:00:00Z',
    },
  ],
  recentPayouts: [
    {
      id: 'po-1',
      amount: 800,
      status: 'completed',
      date: '2024-05-01T09:00:00Z',
    },
    {
      id: 'po-2',
      amount: 450,
      status: 'processing',
      date: '2024-05-12T11:00:00Z',
    },
  ],
};
