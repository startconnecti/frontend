'use client';

import { ReactNode, useState } from 'react';
// Note: TanStack Query will be installed in future phases. 
// For now, this is a placeholder to establish the structure.
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: ReactNode }) {
  // const [queryClient] = useState(() => new QueryClient());
  // return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  return <>{children}</>;
}
