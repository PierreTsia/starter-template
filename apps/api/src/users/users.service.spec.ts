import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

import { UserException } from './exceptions/user.exception';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    isEmailConfirmed: false,
    emailConfirmationToken: 'confirmation-token',
    passwordResetToken: null,
    passwordResetExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockLoggerService = {
    logOperation: jest
      .fn()
      .mockImplementation((name: string, operation: () => Promise<unknown>) => operation()),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });

    it('should throw UserException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(UserException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...newUser,
      });

      const result = await service.create(newUser);
      expect(result).toEqual({
        ...mockUser,
        ...newUser,
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: newUser,
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const result = await service.update('1', updateData);
      expect(result).toEqual({
        ...mockUser,
        ...updateData,
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });

    it('should throw UserException if user not found', async () => {
      mockPrismaService.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '1.0.0',
        })
      );

      await expect(service.update('1', { name: 'New Name' })).rejects.toThrow(UserException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.delete('1');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });

    it('should throw UserException if user not found', async () => {
      mockPrismaService.user.delete.mockRejectedValue(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '1.0.0',
        })
      );

      await expect(service.delete('1')).rejects.toThrow(UserException);
    });
  });

  describe('findByEmailConfirmationToken', () => {
    it('should return a user by confirmation token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmailConfirmationToken('confirmation-token');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { emailConfirmationToken: 'confirmation-token' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findByEmailConfirmationToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('findByPasswordResetToken', () => {
    it('should return a user by valid reset token', async () => {
      const userWithResetToken = {
        ...mockUser,
        passwordResetToken: 'reset-token',
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour from now
      };

      mockPrismaService.user.findFirst.mockResolvedValue(userWithResetToken);

      const result = await service.findByPasswordResetToken('reset-token');
      expect(result).toEqual(userWithResetToken);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          passwordResetToken: 'reset-token',
          passwordResetExpires: {
            gt: expect.any(Date) as Date,
          },
        },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findByPasswordResetToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null if token is expired', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findByPasswordResetToken('expired-token');
      expect(result).toBeNull();
    });
  });

  describe('uploadAvatar', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      path: '/tmp/test.jpg',
    } as Express.Multer.File;

    const mockUploadResult = {
      url: 'https://cloudinary.com/test.jpg',
      publicId: 'test-id',
      version: '123',
    };

    const mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailConfirmed: true,
      emailConfirmationToken: null,
      emailConfirmationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      avatarUrl: 'https://cloudinary.com/test.jpg',
    };

    it('should upload avatar and update user successfully', async () => {
      mockCloudinaryService.uploadImage.mockResolvedValue(mockUploadResult);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.uploadAvatar('1', mockFile, 'en');

      expect(result).toEqual(mockUser);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile, 'en');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { avatarUrl: mockUploadResult.url },
        select: expect.any(Object) as Prisma.UserSelect,
      });
    });

    it('should throw UserException when user not found', async () => {
      mockCloudinaryService.uploadImage.mockResolvedValue(mockUploadResult);
      mockPrismaService.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('User not found', { code: 'P2025', clientVersion: '1.0' })
      );

      await expect(service.uploadAvatar('1', mockFile, 'en')).rejects.toThrow(UserException);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile, 'en');
    });

    it('should throw error when Cloudinary upload fails', async () => {
      const error = new Error('Upload failed');
      mockCloudinaryService.uploadImage.mockRejectedValue(error);

      await expect(service.uploadAvatar('1', mockFile, 'en')).rejects.toThrow(error);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile, 'en');
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });
});
