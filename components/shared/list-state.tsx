import { ReactNode } from 'react';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';

interface ListStateProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
}

export function ListState({
  isLoading,
  error,
  isEmpty,
  emptyTitle = 'No data found',
  emptyDescription = 'There is nothing to display here yet.',
  emptyIcon,
  onRetry,
  children
}: ListStateProps) {
  if (isLoading) return <LoadingState />;
  
  if (error) {
    return (
      <ErrorState 
        title="Failed to load data" 
        message={error.message || 'Something went wrong while fetching the data.'} 
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState 
        title={emptyTitle} 
        description={emptyDescription} 
        icon={emptyIcon} 
      />
    );
  }

  return <>{children}</>;
}
