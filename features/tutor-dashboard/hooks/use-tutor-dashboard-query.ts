'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { api } from '@/lib/api/client';
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

      const [tutorRes, dashboardRes, upcomingSessionsRes, reviewsRes, paymentsRes] = await Promise.all([
        tutorDashboardService.getMyTutorProfile(),
        tutorDashboardService.getTutorDashboard().catch(() => ({ sessionsCompleted: 0, totalEarnings: 0 })),
        sessionService.getTutorSessions({
          status: 'scheduled',
          startTime: now.toISOString(),
          endTime: nextWeek.toISOString(),
          tutorId: user?.id,
        }).catch(() => ({ items: [], meta: {} })),
        feedbackService.getTutorReviews({ limit: 10, tutorId: user?.id }).catch(() => ({ items: [], meta: {} })),
        paymentService.getStudentPayments({
          tutorId: user?.id,
          status: 'confirmed',
          limit: 10,
        } as any).catch(() => ({ items: [], meta: {} })),
      ]);

      const sessions = upcomingSessionsRes?.items || [];
      const upcomingSession = sessions[0] || null;
      const allReviews = reviewsRes?.items || [];
      const payments = paymentsRes?.items || [];

      const tutor = tutorRes?.tutorProfile;
      if (!tutor) {
        throw new Error('Tutor profile not found');
      }

      return {
        tutorName: user?.fullName || 'Tutor',
        status: tutor.status as any,
        approvalNote: tutor?.approvalNote,
        isPublic: true,
        stats: {
          sessionsCompleted: dashboardRes?.sessionsCompleted ?? 0,
          totalEarnings: dashboardRes?.totalEarnings ?? 0,
        },
        earnings: {
          monthlyEarnings: dashboardRes?.totalEarnings ?? 0,
          pendingPayoutAmount: dashboardRes?.pendingPayoutAmount ?? 0,
        },
        upcomingSession: upcomingSession ? {
          id: upcomingSession.id || upcomingSession.sessionId,
          studentName: upcomingSession.studentName || upcomingSession.student?.fullName || 'Student',
          studentAvatar: upcomingSession.studentAvatar || upcomingSession.student?.avatarUrl,
          subject: upcomingSession.subjectName || upcomingSession.subject,
          startTime: upcomingSession.startTime,
          endTime: upcomingSession.endTime,
          meetingLink: upcomingSession.meetingUrl || upcomingSession.meetingLink,
        } : null,
        recentReviews: allReviews.map((r: any) => ({
          id: r.id,
          studentName: r.studentName || r.student?.fullName || 'Student',
          rating: r.rating || 5,
          comment: r.comment || '',
          date: r.createdAt || r.date || new Date().toISOString(),
        })),
        recentEarnings: payments.map((p: any) => ({
          id: p.id || p.paymentId,
          subject: p.subject || 'Tutoring Session',
          amount: p.amountTotal || p.amount || 0,
          date: p.paidAt || p.createdAt || new Date().toISOString(),
        })),
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
