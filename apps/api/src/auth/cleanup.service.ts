import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredUnconfirmedAccounts() {
    this.logger.logWithMetadata('Starting cleanup of expired unconfirmed accounts...');

    const now = new Date();

    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          isEmailConfirmed: false,
          emailConfirmationExpires: {
            lt: now,
          },
        },
      });

      this.logger.logWithMetadata(`Cleaned up ${result.count} expired unconfirmed accounts`);
    } catch (error) {
      this.logger.errorWithMetadata('Error during cleanup of expired accounts', error as Error);
    }
  }
}
