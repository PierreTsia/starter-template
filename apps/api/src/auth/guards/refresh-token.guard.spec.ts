import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { RefreshTokenService } from '../refresh-token.service';

import { RefreshTokenGuard } from './refresh-token.guard';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;

  const mockRefreshTokenService = {
    validateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenGuard,
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    guard = module.get<RefreshTokenGuard>(RefreshTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          user: undefined,
        }),
      }),
    } as ExecutionContext;

    it('should throw UnauthorizedException when no authorization header is present', async () => {
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('No refresh token provided')
      );
    });

    it('should throw UnauthorizedException when authorization header is malformed', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'InvalidFormat',
            },
            user: undefined,
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid-token',
            },
            user: undefined,
          }),
        }),
      } as ExecutionContext;

      mockRefreshTokenService.validateRefreshToken.mockResolvedValueOnce(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
    });

    it('should attach user ID to request and return true when refresh token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
        user: undefined,
      } as Request;

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const mockPayload = { userId: 'user-123' };
      mockRefreshTokenService.validateRefreshToken.mockResolvedValueOnce(mockPayload);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual({ id: 'user-123' });
      expect(mockRefreshTokenService.validateRefreshToken).toHaveBeenCalledWith('valid-token');
    });
  });
});
