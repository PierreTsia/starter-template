import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { RefreshTokenService } from '../refresh-token.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') {
  constructor(private refreshTokenService: RefreshTokenService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const refreshToken = authHeader.replace('Bearer ', '');
    const payload = await this.refreshTokenService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Attach the user ID to the request for later use
    request.user = { id: payload.userId };
    return true;
  }
}
