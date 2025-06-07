import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRefreshToken', () => {
    it('should generate and store a refresh token', async () => {
      const userId = 'test-user-id';
      const mockToken = 'mock-token';
      const mockExpiresAt = new Date();

      mockPrismaService.refreshToken.create.mockResolvedValue({
        token: mockToken,
        userId,
        expiresAt: mockExpiresAt,
      });

      const result = await service.generateRefreshToken(userId);

      expect(result).toBeDefined();
      expect(result.length).toBe(80); // 40 bytes in hex = 80 characters

      expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith({
        data: {
          token: expect.any(String),
          userId,

          expiresAt: expect.any(Date),
        },
      });
    });
  });

  describe('validateRefreshToken', () => {
    it('should return userId for valid token', async () => {
      const mockToken = 'valid-token';
      const mockUserId = 'test-user-id';
      const mockExpiresAt = new Date(Date.now() + 86400000); // tomorrow

      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        token: mockToken,
        userId: mockUserId,
        expiresAt: mockExpiresAt,
        user: { id: mockUserId },
      });

      const result = await service.validateRefreshToken(mockToken);

      expect(result).toEqual({ userId: mockUserId });
      expect(mockPrismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken },
        include: { user: true },
      });
    });

    it('should return null for expired token', async () => {
      const mockToken = 'expired-token';
      const mockExpiresAt = new Date(Date.now() - 86400000); // yesterday

      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        token: mockToken,
        userId: 'test-user-id',
        expiresAt: mockExpiresAt,
        user: { id: 'test-user-id' },
      });

      const result = await service.validateRefreshToken(mockToken);

      expect(result).toBeNull();
    });

    it('should return null for non-existent token', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      const result = await service.validateRefreshToken('non-existent-token');

      expect(result).toBeNull();
    });
  });

  describe('revokeRefreshToken', () => {
    it('should delete the refresh token', async () => {
      const mockToken = 'token-to-revoke';

      await service.revokeRefreshToken(mockToken);

      expect(mockPrismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: mockToken },
      });
    });
  });

  describe('revokeAllUserRefreshTokens', () => {
    it('should delete all refresh tokens for a user', async () => {
      const mockUserId = 'test-user-id';

      await service.revokeAllUserRefreshTokens(mockUserId);

      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });
});
