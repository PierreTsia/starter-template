import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

interface CreateUserData {
  email: string;
  password: string;
  name?: string;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
}

const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};
type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({ select: userSelect });
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // For login, you may need the password, so do not use select here
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData): Promise<SafeUser> {
    return this.prisma.user.create({
      data,
      select: userSelect,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<SafeUser> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<SafeUser> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userSelect,
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
