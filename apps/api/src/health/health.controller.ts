import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { HEALTH_RESPONSES } from '../common/swagger/schemas';

@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse(HEALTH_RESPONSES.OK)
  @Get()
  check() {
    return { status: 'ok' };
  }
}
