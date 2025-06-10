import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

import { CleanupService } from './cleanup.service';

describe('CleanupService', () => {
  let service: CleanupService;
  let prismaService: PrismaService;
  let loggerService: LoggerService;

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
          provide: LoggerService,
          useValue: {
            logWithMetadata: jest.fn(),
            errorWithMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
    prismaService = module.get<PrismaService>(PrismaService);
    loggerService = module.get<LoggerService>(LoggerService);
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
      expect(loggerService.logWithMetadata).toHaveBeenCalledWith(
        'Starting cleanup of expired unconfirmed accounts...'
      );
      expect(loggerService.logWithMetadata).toHaveBeenCalledWith(
        'Cleaned up 2 expired unconfirmed accounts'
      );
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      jest.spyOn(prismaService.user, 'deleteMany').mockRejectedValue(error);

      await expect(service.cleanupExpiredUnconfirmedAccounts()).resolves.not.toThrow();
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Error during cleanup of expired accounts',
        error
      );
    });
  });
});
