import { Controller, Get, Head, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Head('/')
  getRoot(@Res() res: Response) {
    return res.redirect(302, '/api/v1/health');
  }
}
