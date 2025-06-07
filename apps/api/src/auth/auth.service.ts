import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      void password; // explicitly ignore password
      return result;
    }
    return null;
  }

  async login({ email, password }: ILoginDto) {
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
  }

  async register({ email, password, name }: IRegisterDto) {
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
  }

  async refreshTokens(refreshToken: string) {
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
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async generateJwt(user: SafeUser) {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }
}
