# Update User Name

## Overview

Implement a simple endpoint to update the user's name in their profile. This is a focused feature that only handles name updates, keeping the implementation simple and maintainable.

## Backend Implementation

### API Endpoint

```typescript
PUT / api / users / profile;
```

#### Request Body

```typescript
{
  name: string; // 2-50 characters, no special characters
}
```

#### Response

```typescript
{
  id: string;
  name: string;
  email: string;
  // ... other user fields
}
```

### DTO

```typescript
export class UpdateNameDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message: 'Name can only contain letters, numbers, spaces and hyphens',
  })
  name: string;
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
   - Basic update logic
   - Error handling
   - Logging

### Error Cases

- [ ] Invalid name format
- [ ] Name too short
- [ ] Name too long
- [ ] Unauthorized access
- [ ] User not found

### Testing

- [ ] DTO validation works
- [ ] Name update works
- [ ] Error cases handled
- [ ] Authorization works
- [ ] Logging works

## Definition of Done

- [ ] Endpoint implemented
- [ ] DTO validation works
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Swagger documentation updated
- [ ] Logging implemented
