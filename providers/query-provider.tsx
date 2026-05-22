'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const handleGlobalError = (error: any, queryOrMutation: any) => {
      // Extract from Axios response structure or direct AdminApiError
      const backendError = error?.response?.data?.error || error?.data?.error || (error?.code ? error : undefined);
      
      // Skip global toast for inline form validation failures if preferred
      if (backendError?.code === 'Validation.Failed') return;

      // Allow queries or mutations to explicitly disable global error toasts
      if (queryOrMutation?.meta?.showErrorToast === false) return;

      if (backendError?.code) {
        toast.error(backendError.message || "An error occurred.");
        return;
      }

      const errorMessage = error?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    };

    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => handleGlobalError(error, query),
      }),
      mutationCache: new MutationCache({
        onSuccess: (data: any, variables, context, mutation) => {
          // Extract success message from common backend response structures
          const successMessage = data?.message || data?.data?.message || "Action completed successfully!";
          
          // Allow individual mutations to explicitly disable global toast
          if (mutation.meta?.showToast === false) return;

          toast.success(successMessage);
        },
        onError: (error, variables, context, mutation) => handleGlobalError(error, mutation),
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
