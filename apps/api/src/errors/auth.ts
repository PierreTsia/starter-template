import { messageResolver } from './message-resolver';
import { ApiError } from './types';

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'AUTH.EMAIL_NOT_CONFIRMED',
  TOKEN_EXPIRED: 'AUTH.TOKEN_EXPIRED',
  INVALID_TOKEN: 'AUTH.INVALID_TOKEN',
  RATE_LIMIT_EXCEEDED: 'AUTH.RATE_LIMIT_EXCEEDED',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const createAuthError = (
  code: AuthErrorCode,
  acceptLanguage?: string,
  params?: Record<string, string | number | boolean>,
  status = 401
): ApiError => {
  const message = messageResolver.resolve(code, acceptLanguage, params);
  const language = messageResolver.parseAcceptLanguage(acceptLanguage);

  return {
    code,
    message,
    status,
    meta: {
      language,
    },
  };
};
