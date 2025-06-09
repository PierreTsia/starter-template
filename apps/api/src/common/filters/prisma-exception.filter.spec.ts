import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { Request } from 'express';

import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
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
      providers: [PrismaExceptionFilter],
    }).compile();

    filter = module.get(PrismaExceptionFilter);
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle P2002 (unique constraint violation)', () => {
      const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: {
          target: ['email'],
        },
      });
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'DATABASE.UNIQUE_CONSTRAINT_VIOLATION',
        message: 'A record with this email already exists',
        status: 409,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle P2025 (record not found)', () => {
      const exception = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '4.0.0',
      });
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'DATABASE.RECORD_NOT_FOUND',
        message: 'Record not found',
        status: 404,
        meta: {
          language: 'en',
        },
      });
    });

    it('should handle unknown errors', () => {
      const exception = new Prisma.PrismaClientKnownRequestError('Unknown error', {
        code: 'UNKNOWN_ERROR',
        clientVersion: '4.0.0',
      });
      const host = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as ArgumentsHost;

      filter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'DATABASE.UNKNOWN_ERROR',
        message: 'An unexpected database error occurred',
        status: 500,
        meta: {
          language: 'en',
        },
      });
    });
  });
});
