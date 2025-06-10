# Handling Confirmation Token Expiration

## Current State Analysis

### Registration Process

- Users receive a confirmation token (`emailConfirmationToken`) upon registration
- Email template states "This link will expire in 24 hours"
- However, no actual expiration check is implemented in the code

### Current Behavior

- Confirmation tokens never expire
- Unconfirmed users cannot log in (blocked by `isEmailConfirmed` check)
- Unconfirmed accounts remain in database indefinitely
- Users cannot re-register with the same email if they miss confirmation
- No way to resend confirmation emails

### Security Concerns

- Email template promises 24-hour expiration but code doesn't enforce it
- Potential for database bloat with abandoned registrations
- No cleanup mechanism for unconfirmed accounts
- Users have no recourse if they miss the confirmation window

## Proposed Hybrid Solution

### 1. Token Expiration

- Add `emailConfirmationExpires` field to User model
- Set expiration to 7 days from registration
- Update confirmation endpoint to check expiration
- Return appropriate error message for expired tokens

### 2. Resend Confirmation

- Add new endpoint `/auth/resend-confirmation`
- Allow users to request new confirmation email
- Generate new token and expiration
- Rate limit to prevent abuse (e.g., max 3 attempts per hour)

### 3. Account Cleanup

- Implement CRON job running every 24 hours
- Delete unconfirmed accounts older than 7 days
- Log cleanup operations for monitoring
- Consider soft delete instead of hard delete

### 4. User Experience Improvements

- Add clear error messages for expired tokens
- Provide resend confirmation option in UI
- Show countdown timer for token expiration
- Allow re-registration after account cleanup

## Implementation Priority

1. Add token expiration and validation
2. Implement resend confirmation endpoint
3. Add CRON job for cleanup
4. Update frontend to handle new flows

## Security Considerations

- Rate limiting for resend confirmation
- Secure token generation
- Proper error messages (don't reveal if email exists)
- Logging for security monitoring

## Future Enhancements

- Email notification before token expiration
- Account recovery options
- Analytics for confirmation rates
- A/B testing for different expiration periods

## Definition of Done

### Database Changes

- [x] Add `emailConfirmationExpires` field to User model
- [x] Create migration for the new field
- [x] Update Prisma schema

### Backend Implementation

- [x] Add token expiration check in confirmation endpoint
- [x] Create resend confirmation endpoint with rate limiting
- [ ] Implement CRON job for cleanup
- [x] Add proper error handling and messages
- [x] Write unit tests for new functionality

### Frontend Implementation

- [ ] Add resend confirmation button/option
- [ ] Show expiration countdown timer
- [ ] Handle expired token errors gracefully
- [ ] Add loading states for confirmation actions

### Documentation

- [x] Update API documentation with new endpoints
- [x] Document rate limiting rules
- [x] Update environment variables documentation

### Testing

- [x] Test rate limiting locally
- [x] Test token expiration
- [ ] Test CRON job locally
- [x] Verify email delivery in development

## Implementation Details

### Backend Changes

- Added `@nestjs/throttler` package for rate limiting
- Added `emailConfirmationExpires` column to users table
- Updated User model with expiration field
- Added ConfigModule and ThrottlerModule to app.module.ts
- Implemented resend confirmation endpoint with rate limiting
- Added error codes and messages for:
  - CONFIRMATION_TOKEN_EXPIRED
  - EMAIL_ALREADY_CONFIRMED
- Updated JWT strategy and tests
- Added ResendConfirmationDto

### Pending Items

- CRON job for cleanup of expired unconfirmed accounts
- Frontend implementation for resend confirmation
- Frontend error handling for expired tokens
- Frontend loading states
- Frontend expiration countdown timer
