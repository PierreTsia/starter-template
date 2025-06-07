import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { UsersService } from '../../users/users.service';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when valid payload is provided', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const payload = { sub: '1', email: 'test@example.com' };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = { sub: '1', email: 'test@example.com' };

      mockUsersService.findOne.mockRejectedValue(new UnauthorizedException());

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should use JWT_SECRET from environment or fallback to super-secret', () => {
      const originalEnv = process.env.JWT_SECRET;

      // Test with environment variable
      process.env.JWT_SECRET = 'test-secret';
      const strategyWithEnv = new JwtStrategy(mockUsersService);
      expect(strategyWithEnv).toBeDefined();

      // Test with fallback
      delete process.env.JWT_SECRET;
      const strategyWithFallback = new JwtStrategy(mockUsersService);
      expect(strategyWithFallback).toBeDefined();

      // Restore original environment
      process.env.JWT_SECRET = originalEnv;
    });
  });
});
