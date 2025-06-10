import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { CleanupService } from './cleanup.service';

describe('CleanupService', () => {
  let service: CleanupService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cleanupExpiredUnconfirmedAccounts', () => {
    it('should delete expired unconfirmed accounts', async () => {
      const mockResult = { count: 2 };
      jest.spyOn(prismaService.user, 'deleteMany').mockResolvedValue(mockResult);

      await service.cleanupExpiredUnconfirmedAccounts();

      expect(prismaService.user.deleteMany).toHaveBeenCalledWith({
        where: {
          isEmailConfirmed: false,
          emailConfirmationExpires: {
            lt: expect.any(Date) as Date,
          },
        },
      });
      expect(logger.log).toHaveBeenCalledWith(
        'Starting cleanup of expired unconfirmed accounts...'
      );
      expect(logger.log).toHaveBeenCalledWith('Cleaned up 2 expired unconfirmed accounts');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      jest.spyOn(prismaService.user, 'deleteMany').mockRejectedValue(error);

      await expect(service.cleanupExpiredUnconfirmedAccounts()).resolves.not.toThrow();
      expect(logger.error).toHaveBeenCalledWith('Error during cleanup of expired accounts:', error);
    });
  });
});
