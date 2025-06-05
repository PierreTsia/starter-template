import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type PrismaError = {
  code: string;
  meta?: {
    target?: string[];
  };
};

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = exception.meta?.target?.[0] ?? 'field';
        response.status(status).json({
          statusCode: status,
          message: `A record with this ${target} already exists`,
          error: 'Conflict',
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Record not found',
          error: 'Not Found',
        });
        break;
      }
      default: {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: 'Internal server error',
          error: 'Internal Server Error',
        });
        break;
      }
    }
  }
}
