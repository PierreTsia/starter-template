import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredUnconfirmedAccounts() {
    this.logger.log('Starting cleanup of expired unconfirmed accounts...');

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

      this.logger.log(`Cleaned up ${result.count} expired unconfirmed accounts`);
    } catch (error) {
      this.logger.error('Error during cleanup of expired accounts:', error);
    }
  }
}
