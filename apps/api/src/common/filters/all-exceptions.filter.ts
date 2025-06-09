import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorCodes, isErrorCode, ErrorCode } from '../../errors/codes';
import { messageResolver } from '../../errors/message-resolver';
import { ApiError } from '../../errors/types';

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  code?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { body?: Record<string, unknown> }>();
    const acceptLanguage = request.headers['accept-language'];

    // If it's already an ApiError, use it directly
    if (this.isApiError(exception)) {
      return response.status(exception.status).json(exception);
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code: ErrorCode = ErrorCodes.SYSTEM.UNKNOWN_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        code = `HTTP.${status}` as ErrorCode;
      } else if (typeof res === 'object' && res !== null) {
        const { message: msg, error: err, code: errCode } = res as HttpExceptionResponse;
        message = msg || err || message;
        code = (errCode || `HTTP.${status}`) as ErrorCode;
      }
    }

    console.error('Exception caught by global filter:', {
      exception,
      path: request.url,
      method: request.method,
      body: request.body as Record<string, unknown>,
      status,
      message,
      code,
    });

    // If the message is a valid error code, use it as the code
    if (typeof message === 'string' && isErrorCode(message)) {
      code = message;
    }

    const apiError: ApiError = {
      code,
      message: messageResolver.resolve(code, acceptLanguage),
      status,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };

    response.status(status).json(apiError);
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error &&
      'status' in error &&
      'meta' in error
    );
  }
}
