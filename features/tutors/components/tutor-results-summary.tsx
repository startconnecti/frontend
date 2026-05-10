'use client';

interface TutorResultsSummaryProps {
  count: number;
  isLoading: boolean;
}

export function TutorResultsSummary({ count, isLoading }: TutorResultsSummaryProps) {
  if (isLoading) return <div className="h-6 w-32 bg-muted animate-pulse rounded" />;

  return (
    <p className="text-sm text-muted-foreground">
      Found <span className="font-semibold text-foreground">{count}</span> {count === 1 ? 'tutor' : 'tutors'} matching your criteria
    </p>
  );
}
