'use client';

import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Feedback } from '../types';

interface TutorProfileReviewsProps {
  feedbacks: Feedback[];
  averageRating: number;
  limit: number;
  offset: number;
  total?: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function TutorProfileReviews({ feedbacks, averageRating, limit, offset, total, onPrevious, onNext }: TutorProfileReviewsProps) {
  const reviews = feedbacks ?? [];
  const canGoPrevious = offset > 0;
  const canGoNext = total !== undefined ? offset + limit < total : reviews.length === limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Student Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="text-2xl font-black">{averageRating.toFixed(1)}</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border/60 text-center">
          <p className="text-sm text-muted-foreground italic">No reviews available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 max-h-[420px] space-y-6 overflow-y-auto pr-2">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{(review.studentName || 'S')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{review.studentName || 'Student'}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{review.date ? new Date(review.date).toLocaleDateString() : ''}</span>
              </div>
              <div className="relative pl-6 pt-1">
                <Quote className="h-4 w-4 text-muted-foreground/20 absolute left-0 top-0 rotate-180" />
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{review.comment || ''}"
                </p>
              </div>
              <div className="h-px bg-border/40 w-full" />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!canGoPrevious} onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={!canGoNext} onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
