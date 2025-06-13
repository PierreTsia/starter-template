import * as crypto from 'crypto';

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';
import { ErrorCodes } from '../errors/codes';
import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthException } from './exceptions/auth.exception';
import { RefreshTokenService } from './refresh-token.service';

type SafeUser = Omit<PrismaUser, 'password'>;

interface ILoginDto {
  email: string;
  password: string;
}

interface IRegisterDto {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return this.logger.logOperation(
      'Password hashing',
      async () => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
      },
      { saltRounds: 10 }
    );
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return this.logger.logOperation('Password verification', () =>
      bcrypt.compare(plainPassword, hashedPassword)
    );
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    return this.logger.logOperation(
      'User validation',
      async () => {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
          this.logger.warnWithMetadata('User not found during validation', { email });
          return null;
        }

        const isValid = await this.verifyPassword(password, user.password);
        if (!isValid) {
          this.logger.warnWithMetadata('Invalid password during validation', { email });
          return null;
        }

        if (!user.isEmailConfirmed) {
          this.logger.warnWithMetadata('Unconfirmed email during validation', { email });
          throw new UnauthorizedException(ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED);
        }

        const { password: _, ...result } = user;
        void _; // explicitly ignore password
        return result;
      },
      { email }
    );
  }

  async login({ email, password }: ILoginDto) {
    return this.logger.logOperation(
      'Login',
      async () => {
        const user = await this.validateUser(email, password);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }

        const [accessToken, refreshToken] = await Promise.all([
          this.generateJwt(user),
          this.refreshTokenService.generateRefreshToken(user.id),
        ]);

        return {
          user,
          accessToken,
          refreshToken,
        };
      },
      { email }
    );
  }

  async register({ email, password, name }: IRegisterDto) {
    return this.logger.logOperation(
      'Registration',
      async () => {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
          throw new ConflictException(ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await this.hashPassword(password);
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const confirmationExpires = new Date();
        confirmationExpires.setDate(confirmationExpires.getDate() + 7); // 7 days from now

        await this.usersService.create({
          email,
          name,
          password: hashedPassword,
          isEmailConfirmed: false,
          emailConfirmationToken: confirmationToken,
          emailConfirmationExpires: confirmationExpires,
        });

        // Send confirmation email
        await this.emailService.sendConfirmationEmail(email, confirmationToken);

        return { message: 'Please check your email to confirm your account' };
      },
      { email }
    );
  }

  async refreshTokens(refreshToken: string) {
    return this.logger.logOperation('Token refresh', async () => {
      // Strip 'Bearer ' prefix if present
      const cleanToken = refreshToken.replace(/^Bearer\s+/i, '');

      const payload = await this.refreshTokenService.validateRefreshToken(cleanToken);
      if (!payload) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateJwt(user),
        this.refreshTokenService.generateRefreshToken(user.id),
      ]);

      // Revoke the old refresh token
      await this.refreshTokenService.revokeRefreshToken(refreshToken);

      return {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  async logout(refreshToken: string) {
    return this.logger.logOperation('Logout', async () => {
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
      return { message: 'Logged out successfully' };
    });
  }

  async generateJwt(user: SafeUser) {
    return this.logger.logOperation(
      'JWT generation',
      () => this.jwtService.signAsync({ sub: user.id, email: user.email }),
      { userId: user.id }
    );
  }

  async confirmEmail(token: string) {
    return this.logger.logOperation(
      'Email confirmation',
      async () => {
        const user = await this.usersService.findByEmailConfirmationToken(token);
        if (!user) {
          throw new NotFoundException('Invalid confirmation token');
        }

        const currentDate = new Date();
        if (user.emailConfirmationExpires && user.emailConfirmationExpires < currentDate) {
          throw new UnauthorizedException(ErrorCodes.AUTH.CONFIRMATION_TOKEN_EXPIRED);
        }

        await this.usersService.update(user.id, {
          isEmailConfirmed: true,
          emailConfirmationToken: null,
          emailConfirmationExpires: null,
        });

        return { message: 'Email confirmed successfully' };
      },
      { token }
    );
  }

  async forgotPassword(email: string) {
    return this.logger.logOperation(
      'Password reset request',
      async () => {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          // Don't reveal if email exists
          return { message: 'If your email is registered, you will receive a reset link' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await this.usersService.update(user.id, {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        });

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);

        return { message: 'If your email is registered, you will receive a reset link' };
      },
      { email }
    );
  }

  async resetPassword(token: string, newPassword: string) {
    return this.logger.logOperation(
      'Password reset',
      async () => {
        const user = await this.usersService.findByPasswordResetToken(token);
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
          throw new NotFoundException('Invalid or expired reset token');
        }

        const hashedPassword = await this.hashPassword(newPassword);

        await this.usersService.update(user.id, {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        });

        return { message: 'Password reset successful' };
      },
      { token }
    );
  }

  async resendConfirmation(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If your email is registered, you will receive a new confirmation link' };
    }

    if (user.isEmailConfirmed) {
      throw new ConflictException(ErrorCodes.AUTH.EMAIL_ALREADY_CONFIRMED);
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpires = new Date();
    confirmationExpires.setDate(confirmationExpires.getDate() + 7); // 7 days from now

    await this.usersService.update(user.id, {
      emailConfirmationToken: confirmationToken,
      emailConfirmationExpires: confirmationExpires,
    });

    await this.emailService.sendConfirmationEmail(email, confirmationToken);

    return { message: 'If your email is registered, you will receive a new confirmation link' };
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
    acceptLanguage?: string
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw AuthException.userNotFound(acceptLanguage);
      }

      const userWithPassword = await this.usersService.findByEmail(user.email);
      if (!userWithPassword) {
        throw AuthException.userNotFound(acceptLanguage);
      }

      const isPasswordValid = await bcrypt.compare(
        updatePasswordDto.currentPassword,
        userWithPassword.password
      );

      if (!isPasswordValid) {
        throw AuthException.invalidCredentials(acceptLanguage);
      }

      // Check if new password is different from current password
      if (updatePasswordDto.newPassword === updatePasswordDto.currentPassword) {
        throw AuthException.newPasswordSameAsCurrent(acceptLanguage);
      }

      const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
      await this.usersService.update(userId, { password: hashedPassword });

      return { message: 'Password updated successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.errorWithMetadata(`Failed to update password for user ${userId}`, error);
      } else {
        this.logger.errorWithMetadata(
          `Failed to update password for user ${userId}: Unknown error`
        );
      }
      throw error;
    }
  }
}
