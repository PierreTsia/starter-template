# Add Social Authentication Providers

## Overview

Enhance the existing authentication system by adding support for Google and GitHub OAuth providers. This will allow users to register and login using their social accounts while maintaining our current email/password authentication as a fallback.

## Current Authentication System

### Features

- Email/password registration
- Email verification
- JWT-based authentication
- Refresh token mechanism
- Password reset functionality

### Database Schema

```typescript
User {
  id: string;
  email: string;
  password: string;
  name: string;
  isEmailVerified: boolean;
  // ... other fields
}
```

## Implementation Plan

### Phase 1: Database and Model Updates

#### Schema Changes

- [ ] Add social auth fields to User model:
  ```typescript
  User {
    // ... existing fields
    socialAccounts: {
      provider: 'google' | 'github';
      providerId: string;
      email: string;
      name?: string;
      avatarUrl?: string;
    }[];
    // Optional: Add provider-specific fields
    googleId?: string;
    githubId?: string;
  }
  ```

#### Migration Strategy

- [ ] Create migration for new fields
- [ ] Add indexes for provider lookups
- [ ] Update Prisma schema
- [ ] Test migration rollback

### Phase 2: OAuth Configuration

#### Environment Setup

- [ ] Add OAuth credentials to environment:

  ```env
  # Google OAuth
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

  # GitHub OAuth
  GITHUB_CLIENT_ID=your_client_id
  GITHUB_CLIENT_SECRET=your_client_secret
  GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
  ```

#### Provider Configuration

- [ ] Set up Google OAuth:
  - [ ] Create project in Google Cloud Console
  - [ ] Configure OAuth consent screen
  - [ ] Create credentials
  - [ ] Set up authorized redirect URIs
- [ ] Set up GitHub OAuth:
  - [ ] Create OAuth App in GitHub
  - [ ] Configure callback URL
  - [ ] Set up required scopes

### Phase 3: Backend Implementation

#### New Dependencies

- [ ] Install required packages:
  ```bash
  pnpm add @nestjs/passport passport passport-google-oauth20 passport-github2
  pnpm add -D @types/passport-google-oauth20 @types/passport-github2
  ```

#### Auth Module Updates

- [ ] Create social auth strategies:

  ```typescript
  // google.strategy.ts
  @Injectable()
  export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
      private configService: ConfigService,
      private authService: AuthService
    ) {
      super({
        clientID: configService.get('GOOGLE_CLIENT_ID'),
        clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
        callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
        scope: ['email', 'profile'],
      });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
      // Implementation
    }
  }
  ```

#### New Endpoints

- [ ] Add social auth routes:

  ```typescript
  @Controller('auth')
  export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req) {
      // Implementation
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth() {}

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubAuthCallback(@Req() req) {
      // Implementation
    }
  }
  ```

### Phase 4: Frontend Implementation

#### UI Components

- [ ] Create social login buttons:
  ```typescript
  const SocialLoginButtons = () => {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = '/api/auth/google'}
        >
          <GoogleIcon className="mr-2" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = '/api/auth/github'}
        >
          <GithubIcon className="mr-2" />
          Continue with GitHub
        </Button>
      </div>
    );
  };
  ```

#### Auth Flow

- [ ] Handle OAuth callbacks
- [ ] Store tokens
- [ ] Update user state
- [ ] Handle errors
- [ ] Add loading states

### Phase 5: Testing and Security

#### Security Measures

- [ ] Implement CSRF protection
- [ ] Add rate limiting for OAuth attempts
- [ ] Validate OAuth tokens
- [ ] Secure callback URLs
- [ ] Add logging for auth attempts

#### Testing

- [ ] Unit tests for strategies
- [ ] Integration tests for auth flow
- [ ] E2E tests for social login
- [ ] Error handling tests
- [ ] Security tests

## Definition of Done

### Backend

- [ ] Database schema updated
- [ ] OAuth providers configured
- [ ] Auth strategies implemented
- [ ] New endpoints working
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Tests passing

### Frontend

- [ ] Social login buttons added
- [ ] Auth flow implemented
- [ ] Error handling added
- [ ] Loading states implemented
- [ ] Tests passing

### Documentation

- [ ] API endpoints documented
- [ ] OAuth setup guide created
- [ ] Environment variables documented
- [ ] Security measures documented

## Error Handling

### OAuth Errors

- [ ] Provider unavailable
- [ ] Invalid credentials
- [ ] User denied access
- [ ] Callback errors
- [ ] Token validation errors

### User Flow Errors

- [ ] Account already exists
- [ ] Email already in use
- [ ] Provider account not found
- [ ] Account linking errors

## Implementation Battle Plan

### Week 1: Setup and Configuration

- [ ] Set up OAuth providers
- [ ] Update database schema
- [ ] Configure environment variables
- [ ] Install dependencies

### Week 2: Backend Implementation

- [ ] Implement auth strategies
- [ ] Create new endpoints
- [ ] Add error handling
- [ ] Write tests

### Week 3: Frontend Implementation

- [ ] Create UI components
- [ ] Implement auth flow
- [ ] Add error handling
- [ ] Write tests

### Week 4: Testing and Deployment

- [ ] Security testing
- [ ] Performance testing
- [ ] Documentation
- [ ] Deployment

## Rollback Plan

### Triggers for Rollback

- Critical security issues
- OAuth provider issues
- Database migration problems
- Breaking changes in auth flow

### Rollback Steps

1. Disable social auth endpoints
2. Revert database changes
3. Remove OAuth configurations
4. Restore original auth flow
5. Update documentation

## Monitoring and Maintenance

### Metrics to Track

- [ ] Social login success rate
- [ ] Error rates by provider
- [ ] Response times
- [ ] Token validation times
- [ ] User conversion rates

### Maintenance Tasks

- [ ] Regular OAuth provider checks
- [ ] Token validation updates
- [ ] Security patch updates
- [ ] Provider API changes monitoring
