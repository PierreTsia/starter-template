import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { UsersService } from '../../users/users.service';

import { JwtStrategy } from './jwt.strategy';

type SafeUser = Omit<User, 'password'>;

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              return defaultValue;
            }),
          },
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
      const mockUser: SafeUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const payload = { sub: '123', email: 'test@example.com' };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = { sub: '123', email: 'test@example.com' };

      mockUsersService.findOne.mockResolvedValue(null as unknown as SafeUser);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    });
  });
});
