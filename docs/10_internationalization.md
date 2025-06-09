# Internationalization (i18n)

## Overview

Implement internationalization to support both English (en) and French (fr) languages across the application. This includes frontend UI elements, error messages, and API responses.

## Frontend Implementation

### Setup

- [x] Install required dependencies:
  ```bash
  pnpm add react-intl @formatjs/intl-localematcher
  ```
- [x] Create language detection utility
- [x] Set up language context/provider
- [x] Configure language switching mechanism

### Message Structure

- [x] Create message files:
  ```
  apps/web/src/i18n/
  ├── en.json
  └── fr.json
  ```
- [x] Organize messages by feature/component
- [x] Include common UI elements
- [x] Include error messages
- [x] Include validation messages

### Components

- [x] Wrap app with IntlProvider
- [x] Create language switcher component
- [x] Add language persistence (localStorage)
- [x] Add loading states for language switching

### Testing

- [x] Test language switching

## Backend Implementation

### Error Codes

- [ ] Create error code enum/constants
- [ ] Map error codes to messages
- [ ] Update error responses to include:
  ```typescript
  {
    code: string;      // e.g., "AUTH.INVALID_CREDENTIALS"
    message: string;   // Default English message
    params?: object;   // Optional parameters for message interpolation
  }
  ```

### Error Categories

- [ ] Authentication errors (AUTH.\*)
- [ ] Validation errors (VALIDATION.\*)
- [ ] Business logic errors (BUSINESS.\*)
- [ ] System errors (SYSTEM.\*)

### API Response Structure

```typescript
// Success response
{
  data: T;
  meta?: {
    language?: string;
  };
}

// Error response
{
  error: {
    code: string;
    message: string;
    params?: object;
  };
  meta?: {
    language?: string;
  };
}
```

## Definition of Done

### Frontend

- [x] Language switching works
- [x] All static text is internationalized
- [x] Date/time formatting is localized
- [x] Number formatting is localized
- [x] Error messages are translated
- [x] Language preference is persisted
- [x] Default language fallback works
- [x] Loading states during language switch

### Backend

- [ ] Error codes implemented
- [ ] Error messages structured
- [ ] API responses include language info
- [ ] Validation messages use error codes
- [ ] Business logic errors use error codes

### Testing

- [ ] Language switching works
- [ ] Error messages display correctly
- [ ] API responses are properly structured
- [ ] Fallback language works
- [ ] Date/number formatting is correct

### Documentation

- [ ] Document error codes
- [ ] Document message structure
- [ ] Document language switching
- [ ] Update API documentation

## Example Error Codes

### Authentication

```typescript
const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'AUTH.EMAIL_NOT_CONFIRMED',
  TOKEN_EXPIRED: 'AUTH.TOKEN_EXPIRED',
  INVALID_TOKEN: 'AUTH.INVALID_TOKEN',
  RATE_LIMIT_EXCEEDED: 'AUTH.RATE_LIMIT_EXCEEDED',
} as const;

type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
```

### Validation

```typescript
const VALIDATION_ERROR_CODES = {
  REQUIRED_FIELD: 'VALIDATION.REQUIRED_FIELD',
  INVALID_EMAIL: 'VALIDATION.INVALID_EMAIL',
  PASSWORD_TOO_SHORT: 'VALIDATION.PASSWORD_TOO_SHORT',
  PASSWORD_MISMATCH: 'VALIDATION.PASSWORD_MISMATCH',
} as const;

type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[keyof typeof VALIDATION_ERROR_CODES];
```

### Usage Example

```typescript
// Type-safe error creation
const createAuthError = (code: AuthErrorCode, message: string) => ({
  code,
  message,
  params: {},
});

// TypeScript will ensure only valid codes are used
const error = createAuthError(AUTH_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
```

## Example Message Files

### en.json

```json
{
  "auth": {
    "login": "Login",
    "register": "Register",
    "errors": {
      "invalidCredentials": "Invalid email or password",
      "emailNotConfirmed": "Please confirm your email before logging in",
      "tokenExpired": "Your session has expired. Please log in again"
    }
  },
  "validation": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordTooShort": "Password must be at least 8 characters"
  }
}
```

### fr.json

```json
{
  "auth": {
    "login": "Connexion",
    "register": "S'inscrire",
    "errors": {
      "invalidCredentials": "Email ou mot de passe invalide",
      "emailNotConfirmed": "Veuillez confirmer votre email avant de vous connecter",
      "tokenExpired": "Votre session a expiré. Veuillez vous reconnecter"
    }
  },
  "validation": {
    "required": "Ce champ est obligatoire",
    "invalidEmail": "Veuillez entrer une adresse email valide",
    "passwordTooShort": "Le mot de passe doit contenir au moins 8 caractères"
  }
}
```
