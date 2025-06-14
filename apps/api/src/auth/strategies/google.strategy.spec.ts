import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

import { GoogleStrategy } from './google.strategy';

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      GOOGLE_CLIENT_ID: 'mock-client-id',
      GOOGLE_CLIENT_SECRET: 'mock-client-secret',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
    };
    return config[key];
  }),
};

const mockAuthService = {
  findOrCreateUser: jest.fn(),
};

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    jest.clearAllMocks();
  });

  it('should validate and return user', async () => {
    const fakeProfile: Partial<GoogleProfile> = {
      id: 'google-id',
      emails: [{ value: 'test@example.com', verified: true }],
      displayName: 'Test User',
      photos: [{ value: 'http://avatar.url' }],
    };

    const user = { id: '1', email: 'test@example.com' };
    mockAuthService.findOrCreateUser.mockResolvedValue(user);

    const result = await strategy.validate(
      {} as Request,
      'access-token',
      'refresh-token',
      fakeProfile as GoogleProfile
    );

    expect(mockAuthService.findOrCreateUser).toHaveBeenCalledWith({
      provider: 'google',
      providerId: 'google-id',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: 'http://avatar.url',
    });
    expect(result).toBe(user);
  });

  it('should throw UnauthorizedException if no email', async () => {
    const fakeProfile: Partial<GoogleProfile> = {
      id: 'google-id',
      emails: [],
      displayName: 'Test User',
      photos: [],
    };

    await expect(
      strategy.validate(
        {} as Request,
        'access-token',
        'refresh-token',
        fakeProfile as GoogleProfile
      )
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw InternalServerErrorException if findOrCreateUser throws', async () => {
    const fakeProfile: Partial<GoogleProfile> = {
      id: 'google-id',
      emails: [{ value: 'test@example.com', verified: true }],
      displayName: 'Test User',
      photos: [],
    };
    mockAuthService.findOrCreateUser.mockRejectedValue(new Error('DB error'));

    await expect(
      strategy.validate(
        {} as Request,
        'access-token',
        'refresh-token',
        fakeProfile as GoogleProfile
      )
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should rethrow UnauthorizedException from findOrCreateUser', async () => {
    const fakeProfile: Partial<GoogleProfile> = {
      id: 'google-id',
      emails: [{ value: 'test@example.com', verified: true }],
      displayName: 'Test User',
      photos: [],
    };
    mockAuthService.findOrCreateUser.mockRejectedValue(new UnauthorizedException('nope'));

    await expect(
      strategy.validate(
        {} as Request,
        'access-token',
        'refresh-token',
        fakeProfile as GoogleProfile
      )
    ).rejects.toThrow(UnauthorizedException);
  });
});
