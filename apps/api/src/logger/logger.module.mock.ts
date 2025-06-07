import { Module } from '@nestjs/common';

import { LoggerService } from './logger.service';
import { MockLoggerService } from './logger.service.mock';

@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: MockLoggerService,
    },
  ],
  exports: [LoggerService],
})
export class MockLoggerModule {}
