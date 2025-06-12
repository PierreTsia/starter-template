export const ErrorCodes = {
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
    EMAIL_NOT_CONFIRMED: 'AUTH.EMAIL_NOT_CONFIRMED',
    TOKEN_EXPIRED: 'AUTH.TOKEN_EXPIRED',
    INVALID_TOKEN: 'AUTH.INVALID_TOKEN',
    RATE_LIMIT_EXCEEDED: 'AUTH.RATE_LIMIT_EXCEEDED',
    EMAIL_ALREADY_EXISTS: 'AUTH.EMAIL_ALREADY_EXISTS',
    CONFIRMATION_TOKEN_EXPIRED: 'AUTH.CONFIRMATION_TOKEN_EXPIRED',
    EMAIL_ALREADY_CONFIRMED: 'AUTH.EMAIL_ALREADY_CONFIRMED',
  },
  VALIDATION: {
    FAILED: 'VALIDATION.FAILED',
    INVALID_REQUEST: 'VALIDATION.INVALID_REQUEST',
    REQUIRED_FIELD: 'VALIDATION.REQUIRED_FIELD',
    INVALID_EMAIL: 'VALIDATION.INVALID_EMAIL',
    PASSWORD_TOO_SHORT: 'VALIDATION.PASSWORD_TOO_SHORT',
    PASSWORD_MISMATCH: 'VALIDATION.PASSWORD_MISMATCH',
  },
  DATABASE: {
    UNIQUE_CONSTRAINT_VIOLATION: 'DATABASE.UNIQUE_CONSTRAINT_VIOLATION',
    RECORD_NOT_FOUND: 'DATABASE.RECORD_NOT_FOUND',
    UNKNOWN_ERROR: 'DATABASE.UNKNOWN_ERROR',
  },
  CLOUDINARY: {
    UPLOAD_FAILED: 'CLOUDINARY.UPLOAD_FAILED',
    DELETE_FAILED: 'CLOUDINARY.DELETE_FAILED',
    INVALID_FILE: 'CLOUDINARY.INVALID_FILE',
  },
  HTTP: {
    BAD_REQUEST: 'HTTP.400',
    UNAUTHORIZED: 'HTTP.401',
    FORBIDDEN: 'HTTP.403',
    NOT_FOUND: 'HTTP.404',
    CONFLICT: 'HTTP.409',
    INTERNAL_SERVER_ERROR: 'HTTP.500',
  },
  SYSTEM: {
    UNKNOWN_ERROR: 'SYSTEM.UNKNOWN_ERROR',
  },
} as const;

export type ErrorCode =
  (typeof ErrorCodes)[keyof typeof ErrorCodes][keyof (typeof ErrorCodes)[keyof typeof ErrorCodes]];

export interface ApiError {
  code: ErrorCode;
  message: string;
  status: number;
  meta?: {
    language: string;
    errors?: string[];
  };
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    'status' in error &&
    typeof (error as ApiError).code === 'string' &&
    Object.values(ErrorCodes).some((category) =>
      Object.values(category).includes((error as ApiError).code)
    )
  );
};

export const isRefreshTokenError = (error: unknown) =>
  isApiError(error) && error.code === ErrorCodes.AUTH.TOKEN_EXPIRED;
