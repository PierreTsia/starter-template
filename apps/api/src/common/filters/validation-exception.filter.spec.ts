import { BadRequestException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { Request } from 'express';

import { ValidationExceptionFilter } from './validation-exception.filter';

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let originalConsoleError: typeof console.error;

  beforeEach(async () => {
    // Save original console.error and mock it
    originalConsoleError = console.error;
    console.error = jest.fn();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      headers: {
        'accept-language': 'en',
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationExceptionFilter],
    }).compile();

    filter = module.get(ValidationExceptionFilter);
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should format validation errors when message is an array', () => {
      const exception = new BadRequestException(['Error 1', 'Error 2']);
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'VALIDATION.FAILED',
        message: 'Validation failed',
        status: 400,
        meta: {
          errors: ['Error 1', 'Error 2'],
          language: 'en',
        },
      });
    });

    it('should return original response for non-validation errors', () => {
      const exception = new BadRequestException('Not a validation error');
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'VALIDATION.INVALID_REQUEST',
        message: 'Invalid request',
        status: 400,
        meta: {
          language: 'en',
        },
      });
    });
  });
});
