import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { UserException } from '../../users/exceptions/user.exception';
import { UsersService } from '../../users/users.service';

import { JwtStrategy } from './jwt.strategy';

type SafeUser = Omit<User, 'password'>;

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const mockUser: SafeUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailConfirmed: false,
        emailConfirmationToken: null,
        emailConfirmationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=default',
        provider: null,
        providerId: null,
      };
      const payload = { sub: '123', email: 'test@example.com' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UserException if user not found', async () => {
      const payload = { sub: '123', email: 'test@example.com' };

      jest.spyOn(usersService, 'findOne').mockRejectedValue(UserException.notFound(payload.sub));

      await expect(strategy.validate(payload)).rejects.toThrow(UserException);
      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
    });
  });
});
