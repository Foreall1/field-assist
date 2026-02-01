import { NextRequest } from 'next/server';
import { createAPIRouteClient } from '@/infrastructure/supabase/server';
import { AppError, ErrorCode } from '@/core/errors';
import { handleApiError } from './response';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/infrastructure/supabase/types';

/**
 * Extended request met user informatie
 */
export interface AuthenticatedRequest extends NextRequest {
  user: User;
  userId: string;
  userEmail: string;
  profile?: Profile;
}

/**
 * Context die wordt doorgegeven aan authenticated handlers
 */
export interface AuthContext {
  user: User;
  userId: string;
  userEmail: string;
  profile?: Profile;
}

/**
 * Handler type voor authenticated API routes
 */
type AuthenticatedHandler<T> = (
  request: NextRequest,
  context: AuthContext
) => Promise<T>;

/**
 * Middleware wrapper voor authenticated API routes
 *
 * Gebruik:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   return withAuth(request, async (req, { user, userId }) => {
 *     // Je authenticated logic hier
 *     return successResponse({ data: 'success' });
 *   });
 * }
 * ```
 */
export async function withAuth<T extends Response>(
  request: NextRequest,
  handler: AuthenticatedHandler<T>
): Promise<Response> {
  try {
    const supabase = await createAPIRouteClient();

    // Haal de user op (niet de session - getUser is veiliger)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError.message);
      throw AppError.unauthorized();
    }

    if (!user) {
      throw AppError.unauthorized();
    }

    // Optioneel: haal het profiel op
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const context: AuthContext = {
      user,
      userId: user.id,
      userEmail: user.email || '',
      profile: profile || undefined,
    };

    // Voer de handler uit
    return await handler(request, context);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Middleware wrapper met role check
 *
 * Gebruik:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   return withRole(request, ['vergunningverlener', 'jurist'], async (req, ctx) => {
 *     // Alleen toegankelijk voor vergunningverleners en juristen
 *   });
 * }
 * ```
 */
export async function withRole<T extends Response>(
  request: NextRequest,
  allowedRoles: string[],
  handler: AuthenticatedHandler<T>
): Promise<Response> {
  return withAuth(request, async (req, context) => {
    if (!context.profile) {
      throw AppError.forbidden('Profiel niet gevonden');
    }

    const userRole = context.profile.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw AppError.forbidden(
        `Je rol (${userRole || 'onbekend'}) heeft geen toegang tot deze functie`
      );
    }

    return handler(req, context);
  });
}

/**
 * Verifieer ownership van een resource
 *
 * Gebruik in combinatie met withAuth:
 * ```ts
 * return withAuth(request, async (req, { userId }) => {
 *   const project = await getProject(projectId);
 *   verifyOwnership(project, userId, 'Project');
 *   // ...
 * });
 * ```
 */
export function verifyOwnership(
  resource: { user_id: string } | null,
  userId: string,
  resourceName = 'Resource'
): void {
  if (!resource) {
    throw AppError.notFound(resourceName);
  }

  if (resource.user_id !== userId) {
    throw AppError.forbidden(`Je hebt geen toegang tot dit ${resourceName.toLowerCase()}`);
  }
}

/**
 * Parse en valideer een UUID uit de request
 */
export function parseResourceId(
  request: NextRequest,
  paramName: string
): string {
  const url = new URL(request.url);
  const id = url.searchParams.get(paramName);

  if (!id) {
    throw new AppError(
      `${paramName} is verplicht`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  // Basic UUID validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    throw new AppError(
      `Ongeldig ${paramName} formaat`,
      ErrorCode.VALIDATION_ERROR,
      400
    );
  }

  return id;
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}
