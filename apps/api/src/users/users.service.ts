import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

import { UserException } from './exceptions/user.exception';

interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  isEmailConfirmed?: boolean;
  emailConfirmationToken?: string | null;
  emailConfirmationExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  isEmailConfirmed?: boolean;
  emailConfirmationToken?: string | null;
  emailConfirmationExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
}

const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  emailConfirmationToken: true,
  emailConfirmationExpires: true,
  isEmailConfirmed: true,
  passwordResetExpires: true,
  passwordResetToken: true,
  avatarUrl: true,
} as const;
type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private cloudinaryService: CloudinaryService
  ) {}

  async findAll(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({ select: userSelect });
  }

  async findOne(id: string, acceptLanguage?: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw UserException.notFound(id, acceptLanguage);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // For login, you may need the password, so do not use select here
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData, acceptLanguage?: string): Promise<SafeUser> {
    try {
      return await this.prisma.user.create({
        data,
        select: userSelect,
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw UserException.invalidEmail(acceptLanguage);
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserData, acceptLanguage?: string): Promise<SafeUser> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw UserException.notFound(id, acceptLanguage);
        }
        if (error.code === 'P2002') {
          throw UserException.invalidEmail(acceptLanguage);
        }
      }
      throw error;
    }
  }

  async delete(id: string, acceptLanguage?: string): Promise<SafeUser> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userSelect,
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw UserException.notFound(id, acceptLanguage);
      }
      throw error;
    }
  }

  async findByEmailConfirmationToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { emailConfirmationToken: token },
    });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
    acceptLanguage?: string
  ): Promise<SafeUser> {
    return this.logger.logOperation(
      'uploadAvatar',
      async () => {
        // Get current user to check for existing avatar
        const currentUser = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { avatarUrl: true },
        });

        if (!currentUser) {
          throw UserException.notFound(userId, acceptLanguage);
        }

        // Upload new avatar
        const uploadResult = await this.cloudinaryService.uploadImage(file, userId, acceptLanguage);

        try {
          // Update user's avatar URL
          const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: uploadResult.url },
            select: userSelect,
          });

          // Clean up old avatar if it exists and is a Cloudinary URL
          if (currentUser.avatarUrl) {
            const oldPublicId = this.cloudinaryService.extractPublicIdFromUrl(
              currentUser.avatarUrl
            );
            if (oldPublicId) {
              try {
                await this.cloudinaryService.deleteImage(oldPublicId);
              } catch (error) {
                // Log error but don't fail the operation
                this.logger.errorWithMetadata('Failed to delete old avatar', error as Error, {
                  userId,
                  oldPublicId,
                  oldUrl: currentUser.avatarUrl,
                  error: error instanceof Error ? error.message : String(error),
                });
              }
            } else {
              // Not a Cloudinary URL (probably default avatar), no need to delete
              this.logger.logWithMetadata('Skipping cleanup of non-Cloudinary avatar', {
                userId,
                avatarUrl: currentUser.avatarUrl,
              });
            }
          }

          return updatedUser;
        } catch (error: unknown) {
          if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw UserException.notFound(userId, acceptLanguage);
          }
          throw error;
        }
      },
      {
        userId,
        file: { originalname: file.originalname, mimetype: file.mimetype, size: file.size },
      }
    );
  }
}
