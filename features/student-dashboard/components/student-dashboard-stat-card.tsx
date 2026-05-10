'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StudentDashboardStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export function StudentDashboardStatCard({ 
  label, 
  value, 
  icon: Icon, 
  description,
  trend 
}: StudentDashboardStatCardProps) {
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-black" style={{ color: '#2C1208' }}>{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2">
            {trend && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {trend.value}
              </span>
            )}
            {description && (
              <p className="text-[10px] text-muted-foreground font-medium">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
