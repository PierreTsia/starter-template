import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
  };

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({ ...mockUser, password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email, name: mockUser.name });
    });

    it('should return null if credentials are invalid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({ ...mockUser, password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token if credentials are valid', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockResolvedValue({ id: mockUser.id, email: mockUser.email, name: mockUser.name });
      const result = await service.login({ email: mockUser.email, password: 'password' });
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      await expect(service.login({ email: mockUser.email, password: 'wrong' })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return user data', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      usersServiceMock.create.mockResolvedValue({ ...mockUser, password: 'hashedpassword' });
      const result = await service.register({
        email: mockUser.email,
        password: 'password',
        name: mockUser.name,
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(usersServiceMock.create).toHaveBeenCalledWith({
        email: mockUser.email,
        name: mockUser.name,
        password: 'hashedpassword',
      });
    });
  });
});
