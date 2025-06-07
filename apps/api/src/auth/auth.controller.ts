import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Headers,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

import { LoggerService } from '../logger/logger.service';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new LoggerService(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: { email: string; password: string; name?: string }) {
    return this.authService.register(registerDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Headers('Authorization') auth: string) {
    const refreshToken = auth?.replace('Bearer ', '');
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('Authorization') auth: string) {
    const refreshToken = auth?.replace('Bearer ', '');
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return this.authService.logout(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@Req() req: Request): Omit<User, 'password'> {
    return req.user as Omit<User, 'password'>;
  }
}
