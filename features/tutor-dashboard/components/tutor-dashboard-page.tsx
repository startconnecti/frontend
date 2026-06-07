'use client';

import { 
  Star, 
  TrendingUp, 
  ArrowRight,
  Settings,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useTutorDashboardQuery } from '../hooks/use-tutor-dashboard-query';
import { TutorDashboardStatCard } from './tutor-dashboard-stat-card';
import { TutorUpcomingSessionCard } from './tutor-upcoming-session-card';
import { Skeleton } from '@/components/ui/skeleton';

export function TutorDashboardPage() {
  const { data: rawData, isLoading, isError } = useTutorDashboardQuery();

  const data = rawData;

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError) {
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

  if (!data) {
    return null;
  }

  return (
    <PageContainer className="py-8 space-y-10">
      {/* Status Banners */}
      {data.status === 'pending' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start w-full text-amber-900 dark:text-amber-200 shadow-sm">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 shrink-0">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight">Your tutor profile is under review</h3>
            <div className="text-sm opacity-90 space-y-2">
              <p>Your profile has been submitted and is currently being reviewed by our team. You will be able to start teaching once your profile is approved.</p>
            </div>
          </div>
        </div>
      )}

      {data.status === 'rejected' && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start w-full text-destructive shadow-sm">
          <div className="rounded-full bg-destructive/20 p-2 shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-3 w-full">
            <div>
              <h3 className="font-bold text-lg leading-tight">Your tutor profile was rejected</h3>
            </div>
            
            {data.approvalNote ? (
              <p className="text-sm font-medium">{data.approvalNote}</p>
            ) : (
              <p className="text-sm font-medium">Your profile was rejected. Please update your profile and submit it again.</p>
            )}
          </div>
        </div>
      )}

      {data.status === 'suspended' && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start w-full text-destructive shadow-sm">
          <div className="rounded-full bg-destructive/20 p-2 shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-3 w-full">
            <div>
              <h3 className="font-bold text-lg leading-tight">Your tutor profile has been suspended</h3>
            </div>
            
            {data.approvalNote && (
              <p className="text-sm font-medium">{data.approvalNote}</p>
            )}
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title={`Hello, ${data?.tutorName}!`}
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

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TutorDashboardStatCard 
          label="Completed Sessions" 
          value={data?.stats?.sessionsCompleted ?? 0}
          href={ROUTES.TUTOR.SESSIONS}
          icon={Calendar}
        />
        <TutorDashboardStatCard 
          label="Total Earnings" 
          value={data?.stats?.totalEarnings ?? 0}
          href={ROUTES.TUTOR.INCOME}
          icon={DollarSign}
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
            <TutorUpcomingSessionCard session={data?.upcomingSession} />
          </section>

          {/* Recent Reviews */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-dark">Recent Student Feedback</h3>
              <Button variant="ghost" className="text-primary font-bold gap-2" asChild>
                <Link href={ROUTES.TUTOR.REVIEWS}>
                  All Reviews
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data?.recentReviews || []).map((review: any) => (
                <Card key={review?.id} className="border-border/60 bg-muted/5 hover:bg-white transition-colors">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3 w-3 ${s <= (review?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {review?.date ? new Date(review.date).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm italic text-muted-foreground line-clamp-2">"{review?.comment}"</p>
                    <p className="text-xs font-bold">— {review?.studentName || 'Student'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          {/* Recent Earnings */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Earnings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(!data?.recentEarnings || data.recentEarnings.length === 0) ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No recent earnings</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {data.recentEarnings.map((earning: any) => (
                    <div key={earning?.id} className="p-4 hover:bg-muted/5 transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{earning?.subject}</p>
                        <p className="text-sm font-black">${earning?.amount}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {earning?.date ? new Date(earning.date).toLocaleDateString() : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-4 bg-muted/10 border-t border-border/40">
              <Button variant="ghost" size="sm" className="w-full text-xs font-bold gap-2" asChild>
                <Link href={ROUTES.TUTOR.INCOME}>
                  View Income History
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
