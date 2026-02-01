import { NextResponse } from 'next/server';
import { AppError, ErrorCode, isAppError, toAppError } from '@/core/errors';
import { getRateLimitHeaders, type RateLimitResult } from './rate-limit';
import type { ZodError } from 'zod';

/**
 * Standaard API response structuur
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Creëer een success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Creëer een success response met rate limit headers
 */
export function successResponseWithRateLimit<T>(
  data: T,
  rateLimitResult: RateLimitResult,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return successResponse(data, status, getRateLimitHeaders(rateLimitResult));
}

/**
 * Creëer een error response van een AppError
 */
export function errorResponse(error: AppError): NextResponse<ApiResponse<never>> {
  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && error.details
        ? { details: error.details }
        : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    status: error.statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handle any error en converteer naar API response
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  // Log de error voor debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Als het al een AppError is, gebruik die direct
  if (isAppError(error)) {
    return errorResponse(error);
  }

  // Zod validation errors
  if (isZodError(error)) {
    return errorResponse(
      AppError.validation(formatZodError(error), 'Validatiefout')
    );
  }

  // Supabase errors
  if (isSupabaseError(error)) {
    return handleSupabaseError(error);
  }

  // Converteer naar AppError
  const appError = toAppError(error);

  // Log unexpected errors in productie
  if (process.env.NODE_ENV === 'production' && !appError.isOperational) {
    console.error('Unexpected error:', error);
    // Hier zou je naar een error tracking service kunnen loggen (bijv. Sentry)
  }

  return errorResponse(appError);
}

/**
 * Type guard voor Zod errors
 */
function isZodError(error: unknown): error is ZodError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'issues' in error &&
    Array.isArray((error as ZodError).issues)
  );
}

/**
 * Formatteer Zod errors naar leesbaar formaat
 */
function formatZodError(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root';
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}

/**
 * Type guard voor Supabase errors
 */
interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as SupabaseError).message === 'string'
  );
}

/**
 * Handle Supabase-specifieke errors
 */
function handleSupabaseError(error: SupabaseError): NextResponse<ApiResponse<never>> {
  const code = error.code || '';

  // Auth errors
  if (code.startsWith('auth/') || error.message.includes('JWT')) {
    return errorResponse(AppError.unauthorized(error.message));
  }

  // RLS violations
  if (code === '42501' || error.message.includes('policy')) {
    return errorResponse(AppError.forbidden('Geen toegang tot deze resource'));
  }

  // Not found
  if (code === 'PGRST116') {
    return errorResponse(AppError.notFound());
  }

  // Unique constraint violation
  if (code === '23505') {
    return errorResponse(AppError.alreadyExists('Resource'));
  }

  // Foreign key violation
  if (code === '23503') {
    return errorResponse(
      new AppError(
        'Gerelateerde resource bestaat niet',
        ErrorCode.VALIDATION_ERROR,
        400
      )
    );
  }

  // Default database error
  return errorResponse(AppError.database(error.message));
}

/**
 * Creëer een redirect response
 */
export function redirectResponse(url: string, status: 302 | 301 | 307 | 308 = 302): NextResponse {
  return NextResponse.redirect(url, status);
}

/**
 * Creëer een no content response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Creëer een created response (201)
 */
export function createdResponse<T>(data: T, location?: string): NextResponse<ApiResponse<T>> {
  const headers: Record<string, string> = {};
  if (location) {
    headers['Location'] = location;
  }
  return successResponse(data, 201, headers);
}

/**
 * Streaming response helper voor SSE
 */
export function streamResponse(
  stream: ReadableStream,
  headers?: Record<string, string>
): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      ...headers,
    },
  });
}

/**
 * JSON Lines streaming response
 */
export function jsonLinesResponse(
  stream: ReadableStream,
  headers?: Record<string, string>
): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  });
}
