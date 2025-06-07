import { Controller, Get, Head, Res, Logger } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Head('/')
  getRoot(@Res() res: Response) {
    this.logger.log('Root path accessed - redirecting to health check');
    return res.redirect(302, '/api/v1/health');
  }
}
