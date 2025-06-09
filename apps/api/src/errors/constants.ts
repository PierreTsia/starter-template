export const ERROR_CATEGORIES = {
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  BUSINESS: 'BUSINESS',
  SYSTEM: 'SYSTEM',
} as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];
