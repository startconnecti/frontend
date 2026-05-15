'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { tutorService } from '@/features/tutors/services/tutor-service';
import { sessionService } from '@/features/sessions/services/session-service';
import { feedbackService } from '@/features/feedbacks/services/feedback-service';
import { paymentService } from '@/features/payments/services/payment-service';
import { tutorDashboardService } from '../services/tutor-dashboard-service';
import { TutorDashboardData } from '../types';

export function useTutorDashboardQuery() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['tutor-dashboard', user?.id],
    queryFn: async (): Promise<TutorDashboardData> => {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      const [tutor, dashboardRes, upcomingSessionsRes, reviewsRes, paymentsRes] = await Promise.all([
        tutorService.getTutorById(user?.id || ''),
        tutorDashboardService.getTutorDashboard(),
        sessionService.getTutorSessions({
          status: 'scheduled',
          startTime: now.toISOString(),
          endTime: nextWeek.toISOString(),
          tutorId: user?.id,
        }),
        feedbackService.getTutorReviews({ limit: 10, tutorId: user?.id }),
        paymentService.getStudentPayments({
          tutorId: user?.id,
          status: 'confirmed',
          limit: 10,
        } as any),
      ]);

      const sessions = upcomingSessionsRes.items;
      const upcomingSession = sessions[0] || null;
      const allReviews = reviewsRes.items;

      return {
        tutorName: user?.fullName || 'Tutor',
        approvalStatus: (tutor?.approvalStatus === 'suspended' ? 'rejected' : tutor?.approvalStatus || 'pending') as any,
        isPublic: tutor?.isPublic || false,
        stats: {
          sessionsCompleted: dashboardRes.sessionsCompleted ?? 0,
          totalEarnings: dashboardRes.totalEarnings ?? 0,
        },
        earnings: {
          monthlyEarnings: dashboardRes.totalEarnings ?? 0,
          pendingPayoutAmount: dashboardRes.pendingPayoutAmount ?? 0,
        },
        upcomingSession: upcomingSession ? {
          id: upcomingSession.id,
          studentName: upcomingSession.student?.fullName || 'Student',
          studentAvatar: upcomingSession.student?.avatarUrl,
          subject: upcomingSession.subject,
          startTime: upcomingSession.startTime,
          endTime: upcomingSession.endTime,
          meetingLink: upcomingSession.meetingUrl,
        } : null,
        recentReviews: allReviews.map(r => ({
          id: r.id,
          studentName: r.studentName || 'Student',
          rating: r.rating,
          comment: r.comment || '',
          date: r.createdAt,
        })),
        recentEarnings: paymentsRes.items.map(p => ({
          id: p.id,
          subject: p.subject,
          amount: p.amountTotal,
          date: p.paidAt || p.createdAt,
        })),
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
