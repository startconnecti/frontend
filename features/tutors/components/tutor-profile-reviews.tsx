'use client';

import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Feedback } from '../types';

interface TutorProfileReviewsProps {
  feedbacks: Feedback[];
  averageRating: number;
}

export function TutorProfileReviews({ feedbacks, averageRating }: TutorProfileReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Student Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="text-2xl font-black">{averageRating.toFixed(1)}</span>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border/60 text-center">
          <p className="text-sm text-muted-foreground italic">This tutor hasn't received any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{review.studentName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{review.studentName}</p>
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
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{review.date}</span>
              </div>
              <div className="relative pl-6 pt-1">
                <Quote className="h-4 w-4 text-muted-foreground/20 absolute left-0 top-0 rotate-180" />
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
              <div className="h-px bg-border/40 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
