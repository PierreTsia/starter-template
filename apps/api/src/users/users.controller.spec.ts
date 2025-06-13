import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import * as request from 'supertest';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerService } from '../logger/logger.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateNameDto } from './dto/update-name.dto';
import { UserException } from './exceptions/user.exception';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string;
  emailConfirmationToken: string | null;
  isEmailConfirmed: boolean;
  passwordResetExpires: Date | null;
  passwordResetToken: string | null;
  emailConfirmationExpires: Date | null;
}

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  password: 'Test123!@#',
  createdAt: new Date(),
  updatedAt: new Date(),
  avatarUrl: 'https://cloudinary.com/test.jpg',
  emailConfirmationToken: null,
  isEmailConfirmed: false,
  passwordResetExpires: null,
  passwordResetToken: null,
  emailConfirmationExpires: null,
};

describe('UsersController', () => {
  let app: INestApplication<Express>;
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    uploadAvatar: jest.fn(),
    updateName: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),

    logOperation: jest.fn(
      <T>(
        operation: string,
        fn: () => Promise<T>,
        _metadata?: Record<string, unknown>
      ): Promise<T> => fn()
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );
    await app.init();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1', 'en');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1', 'en');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@test.com',
        password: 'Test123!@#',
        name: 'New User',
      };
      const createdUser = { ...mockUser, ...createUserDto };
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto, 'en');
      expect(result).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto, 'en');
    });

    it('should throw BadRequestException for invalid password', async () => {
      const invalidUserDto = {
        email: 'new@test.com',
        password: 'weak',
        name: 'New User',
      };

      await request(app.getHttpServer()).post('/users').send(invalidUserDto).expect(400);

      // Verify the service is not called
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateData };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateData, 'en');
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateData, 'en');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUsersService.delete.mockResolvedValue(mockUser);

      await controller.delete('1', 'en');
      expect(mockUsersService.delete).toHaveBeenCalledWith('1', 'en');
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      mockUsersService.uploadAvatar.mockResolvedValue(mockUser);

      const result = await controller.uploadAvatar({ user: { id: '1' } } as any, 'en', mockFile);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.uploadAvatar).toHaveBeenCalledWith('1', mockFile, 'en');
    });

    it('should handle file upload errors', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const error = new Error('Upload failed');
      mockUsersService.uploadAvatar.mockRejectedValue(error);

      await expect(
        controller.uploadAvatar({ user: { id: '1' } } as any, 'en', mockFile)
      ).rejects.toThrow(error);

      expect(mockUsersService.uploadAvatar).toHaveBeenCalledWith('1', mockFile, 'en');
    });
  });

  describe('updateName', () => {
    it('should update a user name', async () => {
      const updateNameDto: UpdateNameDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateNameDto };
      mockUsersService.updateName.mockResolvedValue(updatedUser);

      const result = await controller.updateName({ user: mockUser }, updateNameDto, 'en');
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateName).toHaveBeenCalledWith('1', updateNameDto, 'en');
    });

    it('should throw when user is not found', async () => {
      const updateNameDto: UpdateNameDto = { name: 'Updated Name' };
      const error = UserException.notFound('1', 'en');
      mockUsersService.updateName.mockRejectedValue(error);

      await expect(controller.updateName({ user: mockUser }, updateNameDto, 'en')).rejects.toThrow(
        error
      );

      expect(mockUsersService.updateName).toHaveBeenCalledWith('1', updateNameDto, 'en');
    });

    it('should throw BadRequestException for invalid name format', async () => {
      const invalidNameDto = { name: 'Invalid@Name!' }; // Contains special characters

      await request(app.getHttpServer()).patch('/users/profile').send(invalidNameDto).expect(400);

      // Verify the service is not called
      expect(mockUsersService.updateName).not.toHaveBeenCalled();
    });
  });
});
