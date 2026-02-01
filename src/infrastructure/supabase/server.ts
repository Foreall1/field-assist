import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

/**
 * Creëer een server-side Supabase client voor API routes
 *
 * Deze client:
 * - Gebruikt de anon key (respecteert RLS policies)
 * - Leest session uit cookies
 * - Kan alleen in API routes en Server Components worden gebruikt
 */
export async function createAPIRouteClient(): Promise<SupabaseClient<AnyDatabase>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  const cookieStore = await cookies();

  return createSSRServerClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // De setAll methode kan falen in Server Components
          // Dit is acceptabel omdat de session refresh in middleware gebeurt
        }
      },
    },
  });
}

/**
 * Creëer een server-side Supabase client voor Server Components (read-only)
 *
 * Deze client kan alleen lezen, cookies worden niet geschreven.
 */
export async function createServerComponentClient(): Promise<SupabaseClient<AnyDatabase>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  const cookieStore = await cookies();

  return createSSRServerClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op voor Server Components
      },
    },
  });
}

/**
 * Type-safe helper voor het ophalen van de huidige user
 */
export async function getCurrentUser(client: SupabaseClient<AnyDatabase>) {
  const { data: { user }, error } = await client.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Type-safe helper voor het ophalen van de huidige session
 */
export async function getCurrentSession(client: SupabaseClient<AnyDatabase>) {
  const { data: { session }, error } = await client.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}
