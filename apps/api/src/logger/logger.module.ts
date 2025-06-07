import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule, Logger } from 'nestjs-pino';

import { LoggerService } from './logger.service';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: LoggerService,
      useFactory: (logger: Logger) => new LoggerService(logger, 'LoggerService'),
      inject: [Logger],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
