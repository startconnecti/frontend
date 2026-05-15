'use client';

import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StudentDashboardStatCardProps {
  label: string;
  value: string | number;
  href: string;
  icon: LucideIcon;
}

export function StudentDashboardStatCard({ 
  label, 
  value, 
  href,
  icon: Icon,
}: StudentDashboardStatCardProps) {
  return (
    <Card className="h-36 rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300">
      <CardContent className="h-full p-6 flex items-center gap-5">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-muted-foreground truncate">{label}</p>
          <h3 className="text-4xl font-extrabold leading-none text-foreground">{value}</h3>
        </div>
        <Button size="icon" className="h-11 w-11 shrink-0 rounded-full shadow-sm hover:bg-primary/90" asChild>
          <Link href={href} aria-label={`View details for ${label}`}>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
