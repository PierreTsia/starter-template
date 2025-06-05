import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

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
    private readonly jwtService: JwtService
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

    const token = await this.generateJwt(user);
    return {
      user,
      token, // We'll still return this for now, but it will be removed when we implement cookies
    };
  }

  async register({ email, password, name }: IRegisterDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    const token = await this.generateJwt(user);
    return {
      user,
      token, // We'll still return this for now, but it will be removed when we implement cookies
    };
  }

  async generateJwt(user: SafeUser) {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }
}
