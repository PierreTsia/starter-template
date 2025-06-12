import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logger.module';

import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [LoggerModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
