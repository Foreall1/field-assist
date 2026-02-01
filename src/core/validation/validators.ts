import { z, ZodSchema, ZodError } from 'zod';
import { AppError, ErrorCode } from '../errors';

/**
 * Resultaat van een validatie
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

/**
 * Valideer data tegen een Zod schema
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: AppError.validation(formatZodErrors(result.error)),
  };
}

/**
 * Valideer data en gooi een AppError als validatie faalt
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = validate(schema, data);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

/**
 * Async validatie met custom error handling
 */
export async function validateAsync<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    const result = await schema.safeParseAsync(data);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: AppError.validation(formatZodErrors(result.error)),
    };
  } catch (error) {
    return {
      success: false,
      error: new AppError(
        'Validatiefout',
        ErrorCode.VALIDATION_ERROR,
        400,
        { originalError: error }
      ),
    };
  }
}

/**
 * Formatteer Zod errors naar een leesbaar formaat
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
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
 * Haal de eerste error message uit een Zod error
 */
export function getFirstZodError(error: ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) {
    return 'Validatiefout';
  }

  const path = firstIssue.path.join('.');
  return path ? `${path}: ${firstIssue.message}` : firstIssue.message;
}

/**
 * Valideer een UUID string
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Sanitize een string voor veilig gebruik
 */
export function sanitizeString(value: string): string {
  return value
    .trim()
    .replace(/[<>]/g, '') // Verwijder HTML tags
    .slice(0, 10000); // Limiteer lengte
}

/**
 * Valideer en sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
