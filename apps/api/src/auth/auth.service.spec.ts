import * as crypto from 'crypto';

import { UnauthorizedException, NotFoundException } from '@nestjs/common';
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

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let emailService: EmailService;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        isEmailConfirmed: mockUser.isEmailConfirmed,
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
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
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
          isEmailConfirmed: mockUser.isEmailConfirmed,
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
  });

  describe('register', () => {
    it('should throw UnauthorizedException if email already exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create user and send confirmation email', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = {
        id: '1',
        email: newUser.email,
        name: newUser.name,
        isEmailConfirmed: false,
        emailConfirmationToken: 'confirmation-token',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);
      const mockBuffer = Buffer.from('confirmation-token');
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => mockBuffer);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');

      const result = await service.register(newUser);

      expect(usersService.create).toHaveBeenCalledWith({
        email: newUser.email,
        password: 'hashedPassword',
        isEmailConfirmed: false,
        emailConfirmationToken: expect.any(String) as string,
        name: newUser.name,
      });
      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith(
        newUser.email,
        expect.any(String) as string
      );
      expect(result).toEqual({
        user: createdUser,
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
      });
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
