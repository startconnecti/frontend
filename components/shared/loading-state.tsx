import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  type?: 'page' | 'list';
}

export function LoadingState({ type = 'list' }: LoadingStateProps) {
  if (type === 'page') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center min-h-[400px]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-brand-dark uppercase tracking-widest">Connecti</h3>
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
