import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { messageResolver } from '../../errors/message-resolver';
import { ApiError } from '../../errors/types';

interface ValidationErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const acceptLanguage = request.headers['accept-language'];
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ValidationErrorResponse;

    // If it's a validation error, format it nicely
    if (Array.isArray(exceptionResponse.message)) {
      const apiError: ApiError = {
        code: 'VALIDATION.FAILED',
        message: messageResolver.resolve('VALIDATION.FAILED', acceptLanguage),
        status,
        meta: {
          language: messageResolver.parseAcceptLanguage(acceptLanguage),
          errors: exceptionResponse.message,
        },
      };
      return response.status(status).json(apiError);
    }

    // For other bad requests, return as is
    const apiError: ApiError = {
      code: 'VALIDATION.INVALID_REQUEST',
      message: messageResolver.resolve('VALIDATION.INVALID_REQUEST', acceptLanguage),
      status,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return response.status(status).json(apiError);
  }
}
