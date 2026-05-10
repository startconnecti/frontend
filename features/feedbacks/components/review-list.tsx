'use client';

import { Star } from 'lucide-react';
import { Feedback } from '../types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewListProps {
  reviews: Feedback[];
  showParticipant?: boolean;
}

export function ReviewList({ reviews, showParticipant = true }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-6 bg-white rounded-3xl border border-border/40 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            {showParticipant && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="font-bold text-xs uppercase bg-primary/5">
                    {review.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black" style={{ color: '#2C1208' }}>{review.studentName}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{review.subject}</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={cn(
                    "h-3.5 w-3.5",
                    star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"
                  )} 
                />
              ))}
            </div>
            
            {!showParticipant && (
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{review.tutorName}</p>
                <p className="text-[10px] text-muted-foreground/60">{review.subject}</p>
              </div>
            )}
          </div>

          {review.comment && (
            <p className="text-sm text-foreground/80 font-medium italic leading-relaxed">
              "{review.comment}"
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <span className="text-[10px] text-muted-foreground font-medium">
              Session ID: {review.sessionId}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold">
              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
