import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
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

  it('should handle P2002 (unique constraint violation)', () => {
    const error = {
      code: 'P2002',
      meta: {
        target: ['email'],
      },
    };

    filter.catch(error, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'A record with this email already exists',
      error: 'Conflict',
    });
  });

  it('should handle P2025 (record not found)', () => {
    const error = {
      code: 'P2025',
    };

    filter.catch(error, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Record not found',
      error: 'Not Found',
    });
  });

  it('should handle unknown errors', () => {
    const error = {
      code: 'UNKNOWN_ERROR',
    };

    filter.catch(error, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  });
});
