import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import { ValidationExceptionFilter } from './validation-exception.filter';

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new ValidationExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should format validation errors when message is an array', () => {
      const validationErrors = ['Error 1', 'Error 2'];
      const exception = new BadRequestException(validationErrors);

      filter.catch(exception, mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Validation failed',
        errors: validationErrors,
      });
    });

    it('should return original response for non-validation errors', () => {
      const errorResponse = {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
      };
      const exception = new BadRequestException(errorResponse);

      filter.catch(exception, mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
