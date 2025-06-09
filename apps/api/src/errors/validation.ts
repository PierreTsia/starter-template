import { messageResolver } from './message-resolver';
import { ApiError } from './types';

export const VALIDATION_ERROR_CODES = {
  REQUIRED_FIELD: 'VALIDATION.REQUIRED_FIELD',
  INVALID_EMAIL: 'VALIDATION.INVALID_EMAIL',
  PASSWORD_TOO_SHORT: 'VALIDATION.PASSWORD_TOO_SHORT',
  PASSWORD_MISMATCH: 'VALIDATION.PASSWORD_MISMATCH',
} as const;

export type ValidationErrorCode =
  (typeof VALIDATION_ERROR_CODES)[keyof typeof VALIDATION_ERROR_CODES];

export const createValidationError = (
  code: ValidationErrorCode,
  acceptLanguage?: string,
  params?: Record<string, string | number | boolean>,
  status = 400
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
