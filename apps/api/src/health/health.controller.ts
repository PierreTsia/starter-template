import { Controller, Get, Head } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SYSTEM_ERROR_RESPONSES, createApiResponse } from '../common/swagger/schemas';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
      },
    },
  })
  @createApiResponse(SYSTEM_ERROR_RESPONSES.INTERNAL_ERROR)
  @createApiResponse(SYSTEM_ERROR_RESPONSES.SERVICE_UNAVAILABLE)
  @Get()
  @Head()
  check() {
    return { status: 'ok' };
  }
}
