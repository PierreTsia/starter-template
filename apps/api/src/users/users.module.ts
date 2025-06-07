import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logger.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
