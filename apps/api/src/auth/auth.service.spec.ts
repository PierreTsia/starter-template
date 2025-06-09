import { UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';
import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  isEmailConfirmed: false,
  emailConfirmationToken: 'confirmation-token',
  passwordResetToken: null,
  passwordResetExpires: null,
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findByEmailConfirmationToken: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
};

const mockRefreshTokenService = {
  generateRefreshToken: jest.fn().mockResolvedValue('mocked-refresh-token'),
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  revokeAllUserRefreshTokens: jest.fn(),
};

const mockLoggerService = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  warnWithMetadata: jest.fn(),

  logOperation: jest.fn(
    <T>(operation: string, fn: () => Promise<T>, _metadata?: Record<string, unknown>): Promise<T> =>
      fn()
  ),
};

const mockEmailService = {
  sendEmail: jest.fn(),
  sendConfirmationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string): string => {
    const config: Record<string, string> = {
      'jwt.access.secret': 'access-secret',
      'jwt.access.expiresIn': '15m',
      'jwt.refresh.secret': 'refresh-secret',
      'jwt.refresh.expiresIn': '7d',
    };
    return config[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        isEmailConfirmed: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        isEmailConfirmed: true,
        emailConfirmationToken: mockUser.emailConfirmationToken,
        passwordResetToken: mockUser.passwordResetToken,
        passwordResetExpires: mockUser.passwordResetExpires,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      const result = await service.validateUser('nonexistent@test.com', 'password123');
      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException when email is not confirmed', async () => {
      const unconfirmedUser = { ...mockUser, isEmailConfirmed: false };
      mockUsersService.findByEmail.mockResolvedValueOnce(unconfirmedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await expect(service.validateUser('test@example.com', 'password123')).rejects.toThrow(
        new UnauthorizedException('AUTH.EMAIL_NOT_CONFIRMED')
      );
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        isEmailConfirmed: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          isEmailConfirmed: true,
          emailConfirmationToken: mockUser.emailConfirmationToken,
          passwordResetToken: mockUser.passwordResetToken,
          passwordResetExpires: mockUser.passwordResetExpires,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unconfirmed email', async () => {
      const unconfirmedUser = { ...mockUser, isEmailConfirmed: false };
      mockUsersService.findByEmail.mockResolvedValueOnce(unconfirmedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(new UnauthorizedException('AUTH.EMAIL_NOT_CONFIRMED'));
    });
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow(new ConflictException('AUTH.EMAIL_ALREADY_EXISTS'));
    });

    it('should return success message without user data or tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      mockUsersService.create.mockResolvedValueOnce(mockUser);
      mockEmailService.sendConfirmationEmail.mockResolvedValueOnce(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toEqual({ message: 'Please check your email to confirm your account' });
      expect(result).not.toHaveProperty('user');
      expect(result).not.toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should create user and send confirmation email', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      mockUsersService.create.mockResolvedValueOnce(mockUser);
      mockEmailService.sendConfirmationEmail.mockResolvedValueOnce(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toEqual({ message: 'Please check your email to confirm your account' });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        isEmailConfirmed: false,
        emailConfirmationToken: expect.any(String) as string,
      });
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String)
      );
    });
  });

  describe('confirmEmail', () => {
    it('should throw NotFoundException if token is invalid', async () => {
      jest.spyOn(usersService, 'findByEmailConfirmationToken').mockResolvedValue(null);

      await expect(service.confirmEmail('invalid-token')).rejects.toThrow(NotFoundException);
    });

    it('should confirm email and clear token', async () => {
      jest.spyOn(usersService, 'findByEmailConfirmationToken').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'update').mockResolvedValue({
        ...mockUser,
        isEmailConfirmed: true,
        emailConfirmationToken: null,
      });

      const result = await service.confirmEmail('valid-token');

      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, {
        isEmailConfirmed: true,
        emailConfirmationToken: null,
      });
      expect(result).toEqual({ message: 'Email confirmed successfully' });
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens when refresh token is valid', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValueOnce({ userId: mockUser.id });
      mockUsersService.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
      });
      expect(mockRefreshTokenService.revokeRefreshToken).toHaveBeenCalledWith(
        'valid-refresh-token'
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValueOnce(null);

      await expect(service.refreshTokens('invalid-refresh-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('should revoke refresh token', async () => {
      await service.logout('valid-refresh-token');
      expect(mockRefreshTokenService.revokeRefreshToken).toHaveBeenCalledWith(
        'valid-refresh-token'
      );
    });
  });
});
