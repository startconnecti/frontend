import { StudentDashboardData } from './types';

export const MOCK_STUDENT_DASHBOARD_DATA: StudentDashboardData = {
  studentName: 'Alex Johnson',
  stats: {
    pendingBookingsCount: 2,
    completedSessionsCount: 15,
    favoriteTutorsCount: 4,
    totalSpent: 450,
  },
  upcomingSession: {
    id: 'sess-123',
    tutorName: 'Dr. Sarah Wilson',
    tutorAvatar: 'https://i.pravatar.cc/150?u=sarah',
    subject: 'Advanced Physics',
    startTime: '2024-05-15T14:00:00Z',
    endTime: '2024-05-15T15:00:00Z',
    meetingLink: 'https://zoom.us/j/123456789',
  },
  recentPayments: [
    {
      id: 'pay-1',
      tutorName: 'James Miller',
      subject: 'Calculus II',
      amount: 45.00,
      status: 'completed',
      date: '2024-05-10T10:30:00Z',
    },
    {
      id: 'pay-2',
      tutorName: 'Sarah Wilson',
      subject: 'Physics',
      amount: 60.00,
      status: 'completed',
      date: '2024-05-08T15:00:00Z',
    },
  ],
  recommendedTutors: [
    {
      id: 'tutor-1',
      fullName: 'Dr. Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      title: 'Expert Physics & Math Tutor',
      bio: 'PhD in Theoretical Physics with 10 years of teaching experience.',
      hourlyRate: 60,
      rating: 4.9,
      reviewCount: 124,
      subjects: ['Physics', 'Mathematics', 'Calculus'],
      isVerified: true,
      approvalStatus: 'approved',
    },
    {
      id: 'tutor-2',
      fullName: 'James Miller',
      avatar: 'https://i.pravatar.cc/150?u=james',
      title: 'Mathematics Enthusiast',
      bio: 'Helping students master complex mathematical concepts with ease.',
      hourlyRate: 45,
      rating: 4.8,
      reviewCount: 89,
      subjects: ['Calculus', 'Algebra', 'Statistics'],
      isVerified: true,
      approvalStatus: 'approved',
    }
  ]
};
