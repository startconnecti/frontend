'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { tutorService } from '@/features/tutors/services/tutor-service';
import { sessionService } from '@/features/sessions/services/session-service';
import { feedbackService } from '@/features/feedbacks/services/feedback-service';
import { TutorDashboardData } from '../types';

export function useTutorDashboardQuery() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['tutor-dashboard', user?.id],
    queryFn: async (): Promise<TutorDashboardData> => {
      const [tutor, sessions, reviewData] = await Promise.all([
        tutorService.getTutorById(user?.id || ''),
        sessionService.getTutorSessions({ status: 'all' }),
        feedbackService.getTutorReviewSummary(),
      ]);

      const upcomingSession = sessions.find(s => s.status === 'scheduled') || null;
      const completedSessions = sessions.filter(s => s.status === 'completed');
      
      // Calculate earnings from completed sessions
      const totalEarnings = completedSessions.reduce((acc, s) => acc + (s.paymentSummary?.amount || 0), 0);
      const allReviews = await feedbackService.getTutorReviews();

      return {
        tutorName: user?.fullName || 'Tutor',
        approvalStatus: (tutor?.approvalStatus === 'suspended' ? 'rejected' : tutor?.approvalStatus || 'pending') as any,
        isPublic: tutor?.isPublic || false,
        stats: {
          totalSessions: sessions.length,
          completedSessions: completedSessions.length,
          averageRating: reviewData.averageRating,
          reviewCount: reviewData.totalReviews,
        },
        earnings: {
          monthlyEarnings: totalEarnings,
          pendingPayoutAmount: 0,
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
        recentReviews: allReviews.slice(0, 4).map(r => ({
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
