'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { sessionService } from '@/features/sessions/services/session-service';
import { paymentService } from '@/features/payments/services/payment-service';
import { favoriteService } from '@/features/favorites/services/favorite-service';
import { tutorService } from '@/features/tutors/services/tutor-service';
import { studentDashboardService } from '../services/student-dashboard-service';
import { StudentDashboardData } from '../types';

export function useStudentDashboardQuery() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['student-dashboard', user?.id],
    queryFn: async (): Promise<StudentDashboardData> => {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      const [sessionsRes, paymentsRes, favoritesRes, recommendedTutors, dashboardRes] = await Promise.all([
        sessionService.getStudentSessions({
          status: 'scheduled',
          startTime: now.toISOString(),
          endTime: nextWeek.toISOString(),
          studentId: user?.id,
        }),
        paymentService.getStudentPayments({
          studentId: user?.id,
          status: 'confirmed',
          limit: 10,
        } as any),
        favoriteService.getFavoriteTutors(),
        tutorService.getTutors({ limit: 4 }),
        studentDashboardService.getStudentDashboard()
      ]);

      const sessions = sessionsRes.items;
      const payments = paymentsRes.items;
      const upcomingSession = sessions[0] || null;
      
      return {
        studentName: user?.fullName || 'Student',
        stats: {
          sessionsCompleted: dashboardRes.sessionsCompleted ?? 0,
          favoriteTutorsCount: dashboardRes.favoriteTutorsCount ?? dashboardRes.totalFavoriteTutors ?? favoritesRes.total ?? 0,
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
        recentPayments: payments.map(p => ({
          id: p.id,
          tutorName: p.tutor.fullName,
          subject: p.subject,
          amount: p.amountTotal,
          status: 'confirmed',
          date: p.paidAt || p.createdAt,
        })),
        recommendedTutors: recommendedTutors,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
