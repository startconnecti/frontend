'use client';

import Link from 'next/link';
import { Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared';
import { ROUTES } from '@/constants/routes';

interface TutorBookingSummaryCardProps {
  hourlyRate: number;
}

export function TutorBookingSummaryCard({ hourlyRate }: TutorBookingSummaryCardProps) {
  return (
    <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 bg-background overflow-hidden">
      <CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-baseline gap-1">
          <PriceDisplay amount={hourlyRate} size="xl" className="text-primary font-black" />
          <span className="text-sm text-muted-foreground font-medium">/ hour</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Free 15-minute consultation</p>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Easy online booking</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Satisfaction guarantee</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground px-4">
            You must be logged in to book a session.
          </p>
          <Button className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" asChild>
            <Link href={ROUTES.LOGIN}>
              Book a Lesson
            </Link>
          </Button>
          <Button variant="outline" className="w-full h-12 text-base font-bold" asChild>
            <Link href={ROUTES.LOGIN}>
              Send a Message
            </Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-4 justify-center">
        <p className="text-[10px] text-muted-foreground text-center">
          By booking, you agree to our <span className="underline cursor-pointer">Refund Policy</span>
        </p>
      </CardFooter>
    </Card>
  );
}
