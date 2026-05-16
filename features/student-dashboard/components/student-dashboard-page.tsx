'use client';

import { 
  Search, 
  ArrowRight,
  Calendar,
  Heart,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { StudentDashboardStatCard } from './student-dashboard-stat-card';
import { StudentUpcomingSessionCard } from './student-upcoming-session-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentSessionsQuery } from '@/features/sessions/hooks/use-student-sessions-query';
import { useStudentBookingsQuery } from '@/features/bookings/hooks/use-student-bookings-query';
import { useFavoriteTutorsQuery } from '@/features/favorites/hooks/use-favorite-tutors-query';
import { useAuthStore } from '@/stores/auth-store';

export function StudentDashboardPage() {
  const { user } = useAuthStore();

  // 1. Upcoming Sessions
  const { data: upcomingSessionsData, isLoading: isLoadingUpcoming } = useStudentSessionsQuery({
    status: 'scheduled',
    limit: 1,
  });
  const upcomingSession = upcomingSessionsData?.items[0];

  // 2. Completed Sessions (for stats)
  const { data: completedSessionsData, isLoading: isLoadingCompleted } = useStudentSessionsQuery({
    status: 'completed',
    limit: 1, // We only need the total
  });
  const sessionsCompleted = completedSessionsData?.pagination?.total || 0;

  // 3. Favorite Tutors (for stats)
  const { data: favoritesData, isLoading: isLoadingFavorites } = useFavoriteTutorsQuery();
  const favoriteTutorsCount = favoritesData?.total || favoritesData?.items?.length || 0;

  // 4. Action-Required Bookings (Pending Payment)
  const { data: pendingBookingsData, isLoading: isLoadingBookings } = useStudentBookingsQuery({
    status: 'pending_payment',
    limit: 5,
  });
  const pendingBookings = pendingBookingsData?.data?.items || [];

  return (
    <PageContainer className="py-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title={`Welcome back, ${user?.fullName || 'Student'}!`}
          description="Ready for your next learning session? Here's what's happening today."
        />
        <div className="flex items-center gap-3">
          <Button className="font-bold gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href={ROUTES.DISCOVER}>
              <Search className="h-4 w-4" />
              Find New Tutors
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isLoadingCompleted ? (
          <Skeleton className="h-36 w-full rounded-2xl" />
        ) : (
          <StudentDashboardStatCard 
            label="Completed Sessions" 
            value={sessionsCompleted}
            href={ROUTES.STUDENT.SESSIONS}
            icon={Calendar}
          />
        )}
        {isLoadingFavorites ? (
          <Skeleton className="h-36 w-full rounded-2xl" />
        ) : (
          <StudentDashboardStatCard 
            label="Favorite Tutors" 
            value={favoriteTutorsCount}
            href="/student/favorite-tutors"
            icon={Heart}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Upcoming Session */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-brand-dark">
              <TrendingUp className="h-5 w-5 text-primary" />
              Upcoming Session
            </h3>
            
            {isLoadingUpcoming ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : upcomingSession ? (
              <StudentUpcomingSessionCard session={{
                id: upcomingSession.id,
                tutorName: upcomingSession.tutorName,
                subject: upcomingSession.subjectName,
                startTime: upcomingSession.startTime,
                endTime: upcomingSession.endTime,
                meetingLink: upcomingSession.meetingUrl,
              }} />
            ) : (
              <Card className="border-border/60 shadow-sm border-dashed bg-muted/5 flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg mb-2">No upcoming sessions</CardTitle>
                <p className="text-sm text-muted-foreground max-w-[240px] mb-6">
                  Ready to learn? Find a tutor and book your next session.
                </p>
                <Button asChild>
                  <Link href={ROUTES.DISCOVER}>Browse Tutors</Link>
                </Button>
              </Card>
            )}
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          {/* Action Required Bookings */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Action Required</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingBookings ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : pendingBookings.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No pending payments</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {pendingBookings.map((booking) => (
                    <div key={booking.bookingId} className="p-4 hover:bg-muted/5 transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{booking.subject}</p>
                        <p className="text-sm font-black">${booking.amount}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground">Tutor ID: {booking.tutorProfileId}</p>
                        <p className="text-[10px] font-bold text-amber-600 uppercase">Pending Payment</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-4 bg-muted/10 border-t border-border/40">
              <Button variant="ghost" size="sm" className="w-full text-xs font-bold gap-2" asChild>
                <Link href={ROUTES.STUDENT.BOOKINGS}>
                  View All Bookings
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Quick Links / Help */}
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
            <h4 className="font-bold text-sm text-brand-dark">Need Help?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check out our Help Center or contact support if you have issues with your bookings or sessions.
            </p>
            <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary hover:underline">
              Visit Help Center
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
