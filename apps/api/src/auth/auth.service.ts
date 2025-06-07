import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

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
  private readonly logger = new LoggerService(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    return this.logger.logOperation(
      'User validation',
      async () => {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user;
          void password; // explicitly ignore password
          return result;
        }
        return null;
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
          email,
          name,
          password: hashedPassword,
        });

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

  async refreshTokens(refreshToken: string) {
    return this.logger.logOperation('Token refresh', async () => {
      const payload = await this.refreshTokenService.validateRefreshToken(refreshToken);
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
}
