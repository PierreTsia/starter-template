# Add Social Authentication Providers

## Prerequisites

1. Google Cloud Console Setup
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth Client ID
   - Set up OAuth consent screen:
     - User Type: External
     - App name: Your app name
     - User support email: Your email
     - Developer contact: Your email
   - Create OAuth 2.0 Client ID:
     - Application type: Web application
     - Name: Your app name
     - Authorized JavaScript origins: `https://your-frontend.vercel.app`
     - Authorized redirect URIs: `https://your-backend.render.com/api/v1/auth/google/callback`
   - Save Client ID and Client Secret for environment variables

## Overview

Add Google OAuth authentication to allow users to register and login using their Google accounts. We'll implement this first, then add GitHub later if needed.

## Current Authentication System

- Email/password registration
- JWT-based authentication
- Refresh token mechanism

## Implementation Plan

### 1. Database Updates

```typescript
// Update User model
User {
  // ... existing fields
  provider?: 'google';  // We'll add 'github' later if needed
  providerId?: string;
  avatarUrl?: string;
}
```

### 2. Environment Setup

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.render.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend.vercel.app

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h
```

### 3. Dependencies

```bash
pnpm add @nestjs/passport passport passport-google-oauth20 @nestjs/config @nestjs/jwt
pnpm add -D @types/passport-google-oauth20
```

### 4. Core Implementation

#### Auth Module

```typescript
// auth.module.ts
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### Auth Service

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async findOrCreateUser(data: {
    provider: 'google';
    providerId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    // First try to find user by provider ID
    let user = await this.prisma.user.findFirst({
      where: {
        provider: data.provider,
        providerId: data.providerId,
      },
    });

    if (!user) {
      // If not found, try to find by email
      user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (user) {
        // If user exists but with different auth method, update it
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            provider: data.provider,
            providerId: data.providerId,
            avatarUrl: data.avatarUrl,
          },
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            provider: data.provider,
            providerId: data.providerId,
            avatarUrl: data.avatarUrl,
            isEmailVerified: true, // Social auth emails are pre-verified
          },
        });
      }
    }

    return user;
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id, email: user.email }, { expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: user.id, email: user.email }, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```
