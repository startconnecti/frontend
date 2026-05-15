'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { sessionService } from '@/features/sessions/services/session-service';
import { paymentService } from '@/features/payments/services/payment-service';
import { favoriteService } from '@/features/favorites/services/favorite-service';
import { tutorService } from '@/features/tutors/services/tutor-service';
import { StudentDashboardData } from '../types';

export function useStudentDashboardQuery() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['student-dashboard', user?.id],
    queryFn: async (): Promise<StudentDashboardData> => {
      const [sessions, payments, favorites, recommendedTutors] = await Promise.all([
        sessionService.getStudentSessions({ status: 'all' }),
        paymentService.getStudentPayments({ status: 'all' }),
        favoriteService.getFavoriteTutors(),
        tutorService.getTutors({ limit: 4 })
      ]);

      const upcomingSession = sessions.find(s => s.status === 'scheduled') || null;
      
      return {
        studentName: user?.fullName || 'Student',
        stats: {
          pendingBookingsCount: sessions.filter(s => s.status === 'scheduled').length, // Fallback logic
          completedSessionsCount: sessions.filter(s => s.status === 'completed').length,
          favoriteTutorsCount: favorites.length,
          totalSpent: payments.reduce((acc, p) => acc + (p.status === 'succeeded' ? p.amountTotal : 0), 0),
        },
        upcomingSession: upcomingSession ? {
          id: upcomingSession.id,
          tutorName: upcomingSession.tutor.fullName,
          tutorAvatar: upcomingSession.tutor.avatarUrl,
          subject: upcomingSession.subject,
          startTime: upcomingSession.startTime,
          endTime: upcomingSession.endTime,
          meetingLink: upcomingSession.meetingUrl,
        } : null,
        recentPayments: payments.slice(0, 5).map(p => ({
          id: p.id,
          tutorName: p.tutor.fullName,
          subject: p.subject,
          amount: p.amountTotal,
          status: p.status === 'succeeded' ? 'completed' : p.status === 'pending' ? 'pending' : 'failed',
          date: p.paidAt || p.createdAt,
        })),
        recommendedTutors: recommendedTutors,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
