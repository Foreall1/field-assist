import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

/**
 * Creëer een Supabase client voor gebruik in Next.js middleware
 *
 * Deze functie:
 * - Refresht de session automatisch als nodig
 * - Schrijft nieuwe session cookies naar de response
 * - Retourneert zowel de client als de response
 */
export async function createMiddlewareClient(request: NextRequest) {
  // Creëer een response die we kunnen modificeren
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware');
    return { supabase: null, response };
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
}

/**
 * Haal de huidige user op in middleware context
 */
export async function getMiddlewareUser(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request);

  if (!supabase) {
    return { user: null, response };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}

/**
 * Check of een route publiek is (geen auth nodig)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/health',
  ];

  // Exacte match
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Static assets en Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files met extensies (images, fonts, etc.)
  ) {
    return true;
  }

  return false;
}

/**
 * Check of een route alleen voor niet-ingelogde users is
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/login', '/register', '/forgot-password'];
  return authRoutes.includes(pathname);
}

/**
 * Check of een route een API route is
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api');
}

/**
 * Genereer redirect URL met return path
 */
export function getLoginRedirect(request: NextRequest): NextResponse {
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

/**
 * Genereer redirect naar home (voor ingelogde users op auth pages)
 */
export function getHomeRedirect(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/', request.url));
}
