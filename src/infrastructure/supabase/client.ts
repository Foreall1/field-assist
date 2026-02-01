'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

/**
 * Singleton instance voor browser-side Supabase client
 */
let browserClient: SupabaseClient<AnyDatabase> | null = null;

/**
 * Creëer een browser-side Supabase client
 *
 * Dit is de enige client die in React components gebruikt mag worden.
 * Gebruikt de anon key en respecteert RLS policies.
 */
export function createBrowserSupabaseClient(): SupabaseClient<AnyDatabase> {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return browserClient;
}

/**
 * Hook-friendly alias voor createBrowserSupabaseClient
 */
export const getSupabaseClient = createBrowserSupabaseClient;

/**
 * Reset de singleton instance (voor testing)
 */
export function resetBrowserClient(): void {
  browserClient = null;
}
