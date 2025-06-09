import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import * as request from 'supertest';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerService } from '../logger/logger.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

describe('UsersController', () => {
  let app: INestApplication<Express>;
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          password: 'Test123!@#',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'Test123!@#',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
      const mockUser: User = {
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name || null,
        password: createUserDto.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto, 'en');
      expect(result).toEqual(mockUser);
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
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Updated Name',
        password: 'Test123!@#',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateData, 'en');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateData, 'en');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'Test123!@#',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.delete.mockResolvedValue(mockUser);

      await controller.delete('1', 'en');
      expect(mockUsersService.delete).toHaveBeenCalledWith('1', 'en');
    });
  });
});
