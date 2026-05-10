'use client';

import { Star, BarChart3, TrendingUp, Users } from 'lucide-react';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { useTutorReviewsQuery } from '../hooks/use-tutor-reviews-query';
import { ReviewList } from './review-list';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TutorReviewsPage() {
  const { data, isLoading, isError, refetch } = useTutorReviewsQuery();

  return (
    <PageContainer className="py-8 space-y-10">
      <SectionHeader 
        title="Student Reviews"
        description="Monitor your teaching performance and student feedback."
      />

      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/60 shadow-lg bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-4xl font-black text-primary">{data.summary.averageRating}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= Math.round(data.summary.averageRating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-widest pt-2">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-lg bg-white rounded-3xl overflow-hidden md:col-span-2">
            <CardContent className="p-8 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <BarChart3 className="h-4 w-4 text-primary" />
                Rating Distribution
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = data.summary.distribution[rating] || 0;
                  const percentage = data.summary.totalReviews > 0 ? (count / data.summary.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-xs font-black">{rating}</span>
                        <Star className="h-3 w-3 fill-muted-foreground/40 text-muted-foreground/40" />
                      </div>
                      <Progress value={percentage} className="h-2 flex-1 bg-muted/30" />
                      <span className="text-xs text-muted-foreground font-bold w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase tracking-widest" style={{ color: '#2C1208' }}>Recent Reviews</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {data?.summary.totalReviews || 0} Total Reviews
            </span>
          </div>
        </div>

        <ListState
          isLoading={isLoading}
          isError={isError}
          isEmpty={data?.reviews.length === 0}
          emptyTitle="No reviews yet"
          emptyDescription="You haven't received any reviews from students yet. Complete sessions to start gathering feedback."
          onRetry={() => refetch()}
        >
          <ReviewList reviews={data?.reviews || []} />
        </ListState>
      </div>
    </PageContainer>
  );
}
