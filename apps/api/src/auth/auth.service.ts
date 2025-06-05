import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

interface User {
  id: string;
  email: string;
  name?: string | null;
}

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
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login({ email, password }: ILoginDto) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register({ email, password, name }: IRegisterDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    const { password: _, ...result } = user;
    const token = await this.generateJwt(result);
    return {
      user: result,
      token,
    };
  }

  async generateJwt(user: User) {
    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }
}
