# Update User Password

## Overview

Implement a secure endpoint to update the user's password. This feature is part of the auth module as it deals with authentication concerns.

## Backend Implementation

### API Endpoint

```typescript
PUT / api / auth / password;
```

#### Request Body

```typescript
{
  currentPassword: string;
  newPassword: string; // Must match our PASSWORD_PATTERN
}
```

#### Response

```typescript
{
  message: string; // Success message
}
```

### DTO

```typescript
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_PATTERN, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  newPassword: string;
}
```

### Implementation Steps

1. Create DTO

   - Add validation rules
   - Add Swagger documentation

2. Add Controller Endpoint

   - Use `@CurrentUser()` decorator
   - Add proper error responses
   - Add Swagger documentation

3. Add Service Method
   - Verify current password
   - Check if new password is different from current password
   - Hash and update new password
   - Error handling
   - Logging

### Error Cases

- [x] Invalid password format
- [x] Current password incorrect
- [x] New password same as current password
- [x] Unauthorized access
- [x] User not found

### Testing

- [x] DTO validation works
- [x] Password update works
- [x] Current password verification works
- [x] New password different check works
- [x] Error cases handled
- [x] Authorization works
- [x] Logging works

## Definition of Done

- [x] Endpoint implemented
- [x] DTO validation works
- [x] Password verification works
- [x] New password different check works
- [x] Error handling implemented
- [x] Tests written and passing
- [x] Swagger documentation updated
- [x] Logging implemented
