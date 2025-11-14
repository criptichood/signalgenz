'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from './store-provider';

// Create a single instance of QueryClient for the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {children}
      </StoreProvider>
    </QueryClientProvider>
  );
}