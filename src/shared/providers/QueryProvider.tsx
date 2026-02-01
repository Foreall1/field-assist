'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Default options for React Query
 */
const defaultOptions = {
  queries: {
    // Don't refetch on window focus in development
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    // Retry failed queries 3 times
    retry: 3,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Cache data for 5 minutes
    gcTime: 5 * 60 * 1000,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
  },
};

/**
 * Query Provider component
 *
 * Wraps the application with React Query's QueryClientProvider.
 * Creates a new QueryClient instance per component mount to avoid
 * sharing state between requests in SSR.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Create QueryClient inside state to ensure it's created once per component
  // and not shared between requests (important for SSR)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions,
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
