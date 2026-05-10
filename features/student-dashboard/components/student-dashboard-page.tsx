'use client';

import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Heart, 
  Search, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useStudentDashboardQuery } from '../hooks/use-student-dashboard-query';
import { StudentDashboardStatCard } from './student-dashboard-stat-card';
import { StudentUpcomingSessionCard } from './student-upcoming-session-card';
import { StudentRecommendedTutors } from './student-recommended-tutors';
import { Skeleton } from '@/components/ui/skeleton';

export function StudentDashboardPage() {
  const { data, isLoading, isError } = useStudentDashboardQuery();

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Search className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Failed to load dashboard</h3>
          <p className="text-muted-foreground">Please try refreshing the page later.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title={`Welcome back, ${data.studentName}!`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StudentDashboardStatCard 
          label="Pending Bookings" 
          value={data.stats.pendingBookingsCount} 
          icon={Clock} 
          description="Waiting for approval"
        />
        <StudentDashboardStatCard 
          label="Completed" 
          value={data.stats.completedSessionsCount} 
          icon={CheckCircle2} 
          description="Total hours learned"
          trend={{ value: "+2 this week", isUp: true }}
        />
        <StudentDashboardStatCard 
          label="Favorites" 
          value={data.stats.favoriteTutorsCount} 
          icon={Heart} 
          description="Tutors you love"
        />
        <StudentDashboardStatCard 
          label="Total Spent" 
          value={`$${data.stats.totalSpent}`} 
          icon={CreditCard} 
          description="Lifetime investment"
        />
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
            <StudentUpcomingSessionCard session={data.upcomingSession} />
          </section>

          {/* Recommended Tutors */}
          <section>
            <StudentRecommendedTutors tutors={data.recommendedTutors} />
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          {/* Recent Payments */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data.recentPayments.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No recent transactions</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {data.recentPayments.map((payment) => (
                    <div key={payment.id} className="p-4 hover:bg-muted/5 transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{payment.subject}</p>
                        <p className="text-sm font-black">${payment.amount}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground">{payment.tutorName}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Success</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-4 bg-muted/10 border-t border-border/40">
              <Button variant="ghost" size="sm" className="w-full text-xs font-bold gap-2" asChild>
                <Link href={ROUTES.STUDENT.PAYMENTS}>
                  View Billing History
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
