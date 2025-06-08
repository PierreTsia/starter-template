# Internationalization (i18n)

## Overview

Implement internationalization to support both English (en) and French (fr) languages across the application. This includes frontend UI elements, error messages, and API responses.

## Frontend Implementation

### Setup

- [ ] Install required dependencies:
  ```bash
  pnpm add react-intl @formatjs/intl-localematcher
  ```
- [ ] Create language detection utility
- [ ] Set up language context/provider
- [ ] Configure language switching mechanism

### Message Structure

- [ ] Create message files:
  ```
  apps/web/src/i18n/
  ├── en.json
  └── fr.json
  ```
- [ ] Organize messages by feature/component
- [ ] Include common UI elements
- [ ] Include error messages
- [ ] Include validation messages

### Components

- [ ] Wrap app with IntlProvider
- [ ] Create language switcher component
- [ ] Add language persistence (localStorage)
- [ ] Add loading states for language switching

### Testing

- [ ] Test language switching
- [ ] Test message fallbacks
- [ ] Test date/number formatting
- [ ] Test RTL support if implemented

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

- [ ] Language switching works
- [ ] All static text is internationalized
- [ ] Date/time formatting is localized
- [ ] Number formatting is localized
- [ ] Error messages are translated
- [ ] Language preference is persisted
- [ ] Default language fallback works
- [ ] Loading states during language switch

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
