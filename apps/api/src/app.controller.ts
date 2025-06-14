import { Controller, Get, Head, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';

import { AppService } from './app.service';
import { SYSTEM_ERROR_RESPONSES, createApiResponse } from './common/swagger/schemas';
import { LoggerService } from './logger/logger.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService
  ) {}

  @Get('/test')
  getHello(@I18n() i18n: I18nContext) {
    return i18n.t('test.HELLO');
  }

  @ApiOperation({ summary: 'Root endpoint - redirects to health check' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to /api/v1/health',
  })
  @createApiResponse(SYSTEM_ERROR_RESPONSES.INTERNAL_ERROR)
  @createApiResponse(SYSTEM_ERROR_RESPONSES.SERVICE_UNAVAILABLE)
  @Get('/')
  @Head('/')
  getRoot(@Res() res: Response) {
    this.logger.logWithMetadata('Root path accessed - redirecting to health check');
    return res.redirect(302, '/api/v1/health');
  }
}
