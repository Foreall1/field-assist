/**
 * Error codes voor de applicatie
 */
export enum ErrorCode {
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Custom error class voor gestructureerde error handling
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory methods voor veelvoorkomende errors
   */
  static unauthorized(message = 'Je moet ingelogd zijn om deze actie uit te voeren'): AppError {
    return new AppError(message, ErrorCode.UNAUTHORIZED, 401);
  }

  static forbidden(message = 'Je hebt geen toegang tot deze resource'): AppError {
    return new AppError(message, ErrorCode.FORBIDDEN, 403);
  }

  static notFound(resource = 'Resource'): AppError {
    return new AppError(`${resource} niet gevonden`, ErrorCode.NOT_FOUND, 404);
  }

  static validation(details: unknown, message = 'Validatiefout'): AppError {
    return new AppError(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }

  static rateLimited(message = 'Te veel verzoeken. Probeer het later opnieuw.'): AppError {
    return new AppError(message, ErrorCode.RATE_LIMITED, 429);
  }

  static internal(message = 'Er is een onverwachte fout opgetreden'): AppError {
    return new AppError(message, ErrorCode.INTERNAL_ERROR, 500);
  }

  static database(message = 'Databasefout'): AppError {
    return new AppError(message, ErrorCode.DATABASE_ERROR, 500);
  }

  static externalService(service: string): AppError {
    return new AppError(
      `Fout bij communicatie met ${service}`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      502
    );
  }

  static sessionExpired(): AppError {
    return new AppError(
      'Je sessie is verlopen. Log opnieuw in.',
      ErrorCode.SESSION_EXPIRED,
      401
    );
  }

  static conflict(message: string): AppError {
    return new AppError(message, ErrorCode.CONFLICT, 409);
  }

  static alreadyExists(resource: string): AppError {
    return new AppError(
      `${resource} bestaat al`,
      ErrorCode.ALREADY_EXISTS,
      409
    );
  }

  /**
   * Converteer error naar JSON response format
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(process.env.NODE_ENV === 'development' && this.details
          ? { details: this.details }
          : {}),
      },
    };
  }
}

/**
 * Type guard om te checken of een error een AppError is
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Converteer onbekende errors naar AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.INTERNAL_ERROR,
      500,
      { originalError: error.name }
    );
  }

  return AppError.internal();
}
