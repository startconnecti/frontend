'use client';

import { 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Settings,
  Calendar,
  Search,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useTutorDashboardQuery } from '../hooks/use-tutor-dashboard-query';
import { TutorDashboardStatCard } from './tutor-dashboard-stat-card';
import { TutorApprovalStatusCard } from './tutor-approval-status-card';
import { TutorUpcomingSessionCard } from './tutor-upcoming-session-card';
import { TutorEarningsSummary } from './tutor-earnings-summary';
import { Skeleton } from '@/components/ui/skeleton';

export function TutorDashboardPage() {
  const { data, isLoading, isError } = useTutorDashboardQuery();

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Settings className="h-10 w-10" />
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
          title={`Hello, ${data.tutorName}!`}
          description="Manage your teaching schedule, student requests, and earnings."
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold gap-2" asChild>
            <Link href={ROUTES.TUTOR.PROFILE}>
              <Settings className="h-4 w-4" />
              Profile Settings
            </Link>
          </Button>
          <Button className="font-bold gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href={ROUTES.TUTOR.AVAILABILITY}>
              <Calendar className="h-4 w-4" />
              Update Availability
            </Link>
          </Button>
        </div>
      </div>

      {/* Approval Status */}
      <TutorApprovalStatusCard status={data.approvalStatus} isPublic={data.isPublic} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TutorDashboardStatCard 
          label="Total Sessions" 
          value={data.stats.totalSessions} 
          icon={BookOpen} 
          description="Total bookings received"
        />
        <TutorDashboardStatCard 
          label="Rating" 
          value={data.stats.averageRating} 
          icon={Star} 
          description={`${data.stats.reviewCount} total reviews`}
        />
        <TutorDashboardStatCard 
          label="Completed" 
          value={data.stats.completedSessions} 
          icon={Users} 
          description="Hours taught"
          trend={{ value: "+3 this week", isUp: true }}
        />
        <TutorDashboardStatCard 
          label="New Messages" 
          value={2} 
          icon={MessageCircle} 
          description="Awaiting response"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Upcoming Session */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#2C1208' }}>
              <TrendingUp className="h-5 w-5 text-primary" />
              Upcoming Session
            </h3>
            <TutorUpcomingSessionCard session={data.upcomingSession} />
          </section>

          {/* Recent Reviews */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: '#2C1208' }}>Recent Student Feedback</h3>
              <Button variant="ghost" className="text-primary font-bold gap-2" asChild>
                <Link href={ROUTES.TUTOR.REVIEWS}>
                  All Reviews
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recentReviews.map((review) => (
                <Card key={review.id} className="border-border/60 bg-muted/5 hover:bg-white transition-colors">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground line-clamp-2">"{review.comment}"</p>
                    <p className="text-xs font-bold">— {review.studentName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          {/* Earnings Summary */}
          <TutorEarningsSummary earnings={data.earnings} />

          {/* Recent Payouts */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Payouts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {data.recentPayouts.map((payout) => (
                  <div key={payout.id} className="p-4 flex items-center justify-between group hover:bg-muted/5 transition-colors">
                    <div className="space-y-1">
                      <p className="text-xs font-bold">{new Date(payout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className={`text-[10px] font-bold uppercase ${payout.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {payout.status}
                      </p>
                    </div>
                    <p className="text-sm font-black group-hover:text-primary transition-colors">${payout.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
