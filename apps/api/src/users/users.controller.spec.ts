import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../generated/prisma';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
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
          password: 'hashed',
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
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@test.com',
        password: 'password123',
        name: 'New User',
      };
      const mockUser: User = {
        id: '1',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Updated Name',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateData);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.delete.mockResolvedValue(mockUser);

      await controller.delete('1');
      expect(mockUsersService.delete).toHaveBeenCalledWith('1');
    });
  });
});
