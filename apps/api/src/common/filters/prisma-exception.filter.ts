import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { messageResolver } from '../../errors/message-resolver';
import { ApiError } from '../../errors/types';

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
    const request = ctx.getRequest<Request>();
    const acceptLanguage = request.headers['accept-language'];

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = exception.meta?.target?.[0] ?? 'field';
        const apiError: ApiError = {
          code: 'DATABASE.UNIQUE_CONSTRAINT_VIOLATION',
          message: messageResolver.resolve('DATABASE.UNIQUE_CONSTRAINT_VIOLATION', acceptLanguage, {
            field: target,
          }),
          status,
          meta: {
            language: messageResolver.parseAcceptLanguage(acceptLanguage),
          },
        };
        response.status(status).json(apiError);
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        const apiError: ApiError = {
          code: 'DATABASE.RECORD_NOT_FOUND',
          message: messageResolver.resolve('DATABASE.RECORD_NOT_FOUND', acceptLanguage),
          status,
          meta: {
            language: messageResolver.parseAcceptLanguage(acceptLanguage),
          },
        };
        response.status(status).json(apiError);
        break;
      }
      default: {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        const apiError: ApiError = {
          code: 'DATABASE.UNKNOWN_ERROR',
          message: messageResolver.resolve('DATABASE.UNKNOWN_ERROR', acceptLanguage),
          status,
          meta: {
            language: messageResolver.parseAcceptLanguage(acceptLanguage),
          },
        };
        response.status(status).json(apiError);
        break;
      }
    }
  }
}
