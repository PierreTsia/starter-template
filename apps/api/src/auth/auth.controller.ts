import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Headers,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import {
  AUTH_ERROR_RESPONSES,
  VALIDATION_ERROR_RESPONSES,
  createApiResponse,
} from '../common/swagger/schemas';
import { LoggerService } from '../logger/logger.service';

import { AuthService } from './auth.service';
import { CleanupService } from './cleanup.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendConfirmationDto } from './dto/resend-confirmation.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly cleanupService: CleanupService
  ) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.INVALID_CREDENTIALS)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.EMAIL_EXISTS)
  @createApiResponse(VALIDATION_ERROR_RESPONSES.INVALID_EMAIL)
  @createApiResponse(VALIDATION_ERROR_RESPONSES.PASSWORD_TOO_SHORT)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token generated',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.TOKEN_EXPIRED)
  @ApiBearerAuth()
  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Headers('authorization') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged out',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.INVALID_TOKEN)
  @ApiBearerAuth()
  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @ApiOperation({ summary: 'Confirm email address' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email successfully confirmed',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.INVALID_TOKEN)
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Query() confirmEmailDto: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmailDto.token);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
  })
  @createApiResponse(VALIDATION_ERROR_RESPONSES.INVALID_EMAIL)
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password successfully reset',
  })
  @createApiResponse(AUTH_ERROR_RESPONSES.INVALID_TOKEN)
  @createApiResponse(VALIDATION_ERROR_RESPONSES.PASSWORD_TOO_SHORT)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.resetPassword(token, password);
  }

  @ApiOperation({ summary: 'Resend confirmation email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation email sent successfully',
  })
  @createApiResponse(VALIDATION_ERROR_RESPONSES.INVALID_EMAIL)
  @createApiResponse(AUTH_ERROR_RESPONSES.INVALID_TOKEN)
  @Post('resend-confirmation')
  @UseGuards(ThrottlerGuard)
  async resendConfirmation(@Body() dto: ResendConfirmationDto) {
    return this.authService.resendConfirmation(dto.email);
  }
}
