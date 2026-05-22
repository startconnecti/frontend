'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {


    return new QueryClient({
      queryCache: new QueryCache({
        // We no longer show global error toasts for queries to avoid noise.
        // Page components should handle query errors via inline UI (isError, ErrorBoundary).
      }),
      mutationCache: new MutationCache({
        // We no longer show global success/error toasts for mutations.
        // Mutation hooks or page-level handlers are strictly responsible for user-facing toasts
        // to prevent duplicate notifications.
      }),
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
