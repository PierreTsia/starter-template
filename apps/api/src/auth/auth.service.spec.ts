import { UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';
import { ErrorCodes } from '../errors/codes';
import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

const TODAY = new Date();

const SEVEN_DAYS_FROM_NOW = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const ONE_DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

const ONE_DAY_FROM_NOW = new Date(Date.now() + 24 * 60 * 60 * 1000);

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  createdAt: TODAY,
  updatedAt: TODAY,
  isEmailConfirmed: false,
  emailConfirmationToken: 'valid-token',
  emailConfirmationExpires: SEVEN_DAYS_FROM_NOW,
  passwordResetToken: null,
  passwordResetExpires: null,
  avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=default',
};

const confirmedMockUser = {
  ...mockUser,
  isEmailConfirmed: true,
  emailConfirmationToken: null,
  emailConfirmationExpires: null,
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
      mockUsersService.findByEmail.mockResolvedValueOnce(confirmedMockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const result = await service.validateUser('test@example.com', 'password123');
      const { password: _password, ...userWithoutPassword } = confirmedMockUser;
      expect(result).toEqual(userWithoutPassword);
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
      mockUsersService.findByEmail.mockResolvedValueOnce(confirmedMockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      mockJwtService.signAsync.mockResolvedValueOnce('mocked-jwt-token');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValueOnce('mocked-refresh-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      const { password: _password, ...userWithoutPassword } = confirmedMockUser;
      expect(result).toEqual({
        user: userWithoutPassword,
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
        emailConfirmationExpires: expect.any(Date) as Date,
      });
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String) as string
      );
    });
  });

  describe('confirmEmail', () => {
    it('should throw NotFoundException if token is invalid', async () => {
      jest.spyOn(usersService, 'findByEmailConfirmationToken').mockResolvedValue(null);

      await expect(service.confirmEmail('invalid-token')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if token has expired', async () => {
      const expiredUser = {
        ...mockUser,
        emailConfirmationExpires: ONE_DAY_AGO,
      };
      jest.spyOn(usersService, 'findByEmailConfirmationToken').mockResolvedValue(expiredUser);

      await expect(service.confirmEmail('expired-token')).rejects.toThrow(
        new UnauthorizedException(ErrorCodes.AUTH.CONFIRMATION_TOKEN_EXPIRED)
      );
    });

    it('should confirm email and clear token when valid and not expired', async () => {
      const validUser = {
        ...mockUser,
        emailConfirmationExpires: ONE_DAY_FROM_NOW,
      };
      jest.spyOn(usersService, 'findByEmailConfirmationToken').mockResolvedValue(validUser);
      jest.spyOn(usersService, 'update').mockResolvedValue({
        ...validUser,
        isEmailConfirmed: true,
        emailConfirmationToken: null,
        emailConfirmationExpires: null,
      });

      const result = await service.confirmEmail('valid-token');

      expect(usersService.update).toHaveBeenCalledWith(validUser.id, {
        isEmailConfirmed: true,
        emailConfirmationToken: null,
        emailConfirmationExpires: null,
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

  describe('resendConfirmation', () => {
    it('should return generic message if email not found', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      const result = await service.resendConfirmation('nonexistent@example.com');

      expect(result).toEqual({
        message: 'If your email is registered, you will receive a new confirmation link',
      });
      expect(mockEmailService.sendConfirmationEmail).not.toHaveBeenCalled();
    });

    it('should throw if email is already confirmed', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        isEmailConfirmed: true,
      });

      await expect(service.resendConfirmation('test@example.com')).rejects.toThrow(
        new ConflictException(ErrorCodes.AUTH.EMAIL_ALREADY_CONFIRMED)
      );
      expect(mockEmailService.sendConfirmationEmail).not.toHaveBeenCalled();
    });

    it('should resend confirmation email and update token', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      mockUsersService.update.mockResolvedValueOnce({
        ...mockUser,
        emailConfirmationToken: 'new-token',
        emailConfirmationExpires: expect.any(Date) as Date,
      });

      const result = await service.resendConfirmation('test@example.com');

      expect(result).toEqual({
        message: 'If your email is registered, you will receive a new confirmation link',
      });
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser.id, {
        emailConfirmationToken: expect.any(String) as string,
        emailConfirmationExpires: expect.any(Date) as Date,
      });
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String)
      );
    });
  });
});
