import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { AppError } from '@/core/errors';

/**
 * Rate limiter configuratie per endpoint type
 */
interface RateLimitConfig {
  requests: number;
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Chat endpoint - beperkt vanwege OpenAI kosten
  chat: { requests: 20, window: '1 m' },

  // Document processing - zwaar vanwege embeddings
  'process-document': { requests: 5, window: '1 m' },

  // General API - standaard limiet
  default: { requests: 60, window: '1 m' },

  // Auth endpoints - stricter vanwege security
  auth: { requests: 10, window: '1 m' },
};

/**
 * Redis client voor rate limiting
 * Valt terug op in-memory als Redis niet geconfigureerd is
 */
let redis: Redis | null = null;
let rateLimiters: Map<string, Ratelimit> = new Map();

function getRedis(): Redis | null {
  if (redis) return redis;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.warn(
      'Upstash Redis not configured. Rate limiting will use in-memory fallback. ' +
      'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production.'
    );
    return null;
  }

  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  return redis;
}

/**
 * Get or create a rate limiter for a specific endpoint type
 */
function getRateLimiter(type: string): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  if (rateLimiters.has(type)) {
    return rateLimiters.get(type)!;
  }

  const config = RATE_LIMIT_CONFIGS[type] || RATE_LIMIT_CONFIGS.default;

  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `field-assist:ratelimit:${type}`,
  });

  rateLimiters.set(type, limiter);
  return limiter;
}

/**
 * Result van rate limit check
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

/**
 * Check rate limit voor een specifieke identifier
 *
 * @param identifier - Unieke identifier (bijv. user ID of IP)
 * @param type - Type endpoint voor config lookup
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  type: string = 'default'
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(type);

  // Als geen Redis geconfigureerd, sta alles toe (development)
  if (!limiter) {
    const config = RATE_LIMIT_CONFIGS[type] || RATE_LIMIT_CONFIGS.default;
    return {
      success: true,
      remaining: config.requests,
      reset: Date.now() + 60000,
      limit: config.requests,
    };
  }

  const { success, remaining, reset, limit } = await limiter.limit(identifier);

  return { success, remaining, reset, limit };
}

/**
 * Check rate limit en gooi error als limiet bereikt
 *
 * @param identifier - Unieke identifier (bijv. user ID of IP)
 * @param type - Type endpoint voor config lookup
 * @throws AppError als rate limit bereikt is
 */
export async function enforceRateLimit(
  identifier: string,
  type: string = 'default'
): Promise<RateLimitResult> {
  const result = await checkRateLimit(identifier, type);

  if (!result.success) {
    const resetDate = new Date(result.reset);
    const waitSeconds = Math.ceil((result.reset - Date.now()) / 1000);

    throw AppError.rateLimited(
      `Te veel verzoeken. Probeer het over ${waitSeconds} seconden opnieuw.`
    );
  }

  return result;
}

/**
 * Get rate limit headers voor response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * In-memory rate limiter voor development/fallback
 * NIET gebruiken in productie!
 */
const inMemoryLimits: Map<string, { count: number; resetAt: number }> = new Map();

export function checkInMemoryRateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const existing = inMemoryLimits.get(key);

  if (!existing || existing.resetAt < now) {
    // Reset of nieuwe entry
    inMemoryLimits.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: maxRequests - 1,
      reset: now + windowMs,
      limit: maxRequests,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: existing.resetAt,
      limit: maxRequests,
    };
  }

  existing.count++;
  return {
    success: true,
    remaining: maxRequests - existing.count,
    reset: existing.resetAt,
    limit: maxRequests,
  };
}

/**
 * Clean up oude in-memory entries (call periodiek)
 */
export function cleanupInMemoryLimits(): void {
  const now = Date.now();
  for (const [key, value] of inMemoryLimits.entries()) {
    if (value.resetAt < now) {
      inMemoryLimits.delete(key);
    }
  }
}

// Cleanup elke 5 minuten
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupInMemoryLimits, 5 * 60 * 1000);
}
