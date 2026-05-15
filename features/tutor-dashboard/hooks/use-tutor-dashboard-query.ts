'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { tutorService } from '@/features/tutors/services/tutor-service';
import { sessionService } from '@/features/sessions/services/session-service';
import { feedbackService } from '@/features/feedbacks/services/feedback-service';
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

      const [tutor, dashboardRes, upcomingSessionsRes, reviewsRes] = await Promise.all([
        tutorService.getTutorById(user?.id || ''),
        tutorDashboardService.getTutorDashboard(),
        sessionService.getTutorSessions({
          status: 'scheduled',
          startDate: now.toISOString(),
          endDate: nextWeek.toISOString(),
        }),
        feedbackService.getTutorReviews({ limit: 10 }),
      ]);

      const sessions = upcomingSessionsRes.items;
      const upcomingSession = sessions[0] || null;
      const allReviews = reviewsRes.items;

      return {
        tutorName: user?.fullName || 'Tutor',
        approvalStatus: (tutor?.approvalStatus === 'suspended' ? 'rejected' : tutor?.approvalStatus || 'pending') as any,
        isPublic: tutor?.isPublic || false,
        stats: {
          totalSessions: dashboardRes.totalCompletedSessions || 0,
          completedSessions: dashboardRes.totalCompletedSessions || 0,
          averageRating: dashboardRes.averageRating || 0,
          reviewCount: dashboardRes.totalReviews || 0,
        },
        earnings: {
          monthlyEarnings: dashboardRes.totalEarnings || 0,
          pendingPayoutAmount: dashboardRes.pendingPayoutAmount || 0,
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
        recentPayouts: [],
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
