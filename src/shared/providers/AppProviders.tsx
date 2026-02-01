'use client';

import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from './ToastProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * App Providers component
 *
 * Combines all application providers in the correct order.
 * Order matters: outer providers are available to inner providers.
 *
 * Provider order:
 * 1. QueryProvider - React Query (no dependencies)
 * 2. AuthProvider - Authentication (uses React Query)
 * 3. ToastProvider - Notifications (independent)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
