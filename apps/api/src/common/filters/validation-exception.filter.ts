import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

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
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ValidationErrorResponse;

    // If it's a validation error, format it nicely
    if (Array.isArray(exceptionResponse.message)) {
      return response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors: exceptionResponse.message,
      });
    }

    // For other bad requests, return as is
    return response.status(status).json(exceptionResponse);
  }
}
