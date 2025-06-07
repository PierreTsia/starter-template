import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { LoggerService } from '../logger/logger.service';
import { MockLoggerService } from '../logger/logger.service.mock';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

jest.mock('bcrypt');

const mockUser = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
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

describe('AuthService', () => {
  let service: AuthService;

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
          useClass: MockLoggerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
      const result = await service.validateUser('test@test.com', 'password123');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const result = await service.validateUser('test@test.com', 'wrongpassword');
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
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
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
          email: 'test@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return user data', async () => {
      const newUser = {
        email: 'new@test.com',
        password: 'password123',
        name: 'New User',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      mockUsersService.create.mockResolvedValueOnce({
        ...mockUser,
        ...newUser,
      });

      const result = await service.register(newUser);
      expect(result).toEqual({
        user: {
          ...mockUser,
          ...newUser,
        },
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: newUser.email,
      });
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
