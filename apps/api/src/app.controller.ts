import { Controller, Get, Head, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService
  ) {}

  @Get('/')
  @Head('/')
  getRoot(@Res() res: Response) {
    this.logger.logWithMetadata('Root path accessed - redirecting to health check');
    return res.redirect(302, '/api/v1/health');
  }
}
