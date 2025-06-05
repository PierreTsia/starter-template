import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../generated/prisma';
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

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
