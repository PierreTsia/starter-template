import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { Request } from 'express';

import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
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
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get(AllExceptionsFilter);
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'HTTP.400',
        message: 'Bad request',
        status: HttpStatus.BAD_REQUEST,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Test error', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST
      );
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'HTTP.400',
        message: 'Bad request',
        status: HttpStatus.BAD_REQUEST,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle non-HttpException', () => {
      const exception = new Error('Test error');
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'SYSTEM.UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle HttpException with array message', () => {
      const exception = new HttpException(['Test error 1', 'Test error 2'], HttpStatus.BAD_REQUEST);
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'HTTP.400',
        message: 'Bad request',
        status: HttpStatus.BAD_REQUEST,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle UnauthorizedException with CONFIRMATION_TOKEN_EXPIRED error code', () => {
      const exception = new HttpException(
        'AUTH.CONFIRMATION_TOKEN_EXPIRED',
        HttpStatus.UNAUTHORIZED
      );
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'AUTH.CONFIRMATION_TOKEN_EXPIRED',
        message: 'Your confirmation link has expired. Please request a new one',
        status: HttpStatus.UNAUTHORIZED,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle UnauthorizedException with CONFIRMATION_TOKEN_EXPIRED error code in French', () => {
      const exception = new HttpException(
        'AUTH.CONFIRMATION_TOKEN_EXPIRED',
        HttpStatus.UNAUTHORIZED
      );
      const frenchRequest = {
        ...mockRequest,
        headers: {
          'accept-language': 'fr',
        },
      };
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => frenchRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'AUTH.CONFIRMATION_TOKEN_EXPIRED',
        message: 'Votre lien de confirmation a expiré. Veuillez en demander un nouveau',
        status: HttpStatus.UNAUTHORIZED,
        meta: {
          language: 'fr',
        },
      });
    });
  });
});
