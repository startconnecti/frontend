'use client';

import { Star, Heart, MessageSquare, ShieldCheck, GraduationCap, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TutorProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  experience: number;
}

export function TutorProfileHeader({
  name,
  avatarUrl,
  subjects,
  rating,
  reviewCount,
  hourlyRate,
  experience
}: TutorProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="text-3xl bg-primary/5 text-primary">
          {name?.split(' ').map(n => n[0]).join('') || '?'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-brand-dark">{name}</h1>
              <ShieldCheck className="h-6 w-6 text-primary fill-primary/10" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {subjects?.map(s => (
                <Badge key={s} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-none px-3">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Add to favorites">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Send message">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-lg">{(rating || 0).toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount || 0} reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-5 w-5" />
            <span>{experience || 0} years of experience</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>Responds in 2 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
