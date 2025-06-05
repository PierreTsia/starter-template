import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let app: INestApplication;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      validateUser: jest.fn(),
      generateJwt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return user data and set token cookie for valid credentials', async () => {
      const loginDto: LoginDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = {
        id: '1',
        email: loginDto.email,
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (mockAuthService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mocked-jwt-token',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedUser = {
        ...mockUser,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      expect(response.body).toEqual({ user: expectedUser });
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('token=mocked-jwt-token');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto: LoginDto = { email: 'test@test.com', password: 'wrongpassword' };
      (mockAuthService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid credentials')
      );

      await request(app.getHttpServer()).post('/auth/login').send(loginDto).expect(401);
    });

    it('should return 400 if extra fields are sent in login', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123', extra: 'nope' })
        .expect(400);
    });
  });

  describe('/auth/register (POST)', () => {
    it('should create a new user and return user data with token cookie', async () => {
      const registerDto: RegisterDto = {
        email: 'new@test.com',
        password: 'password123',
        name: 'New User',
      };

      const mockUser = {
        id: '1',
        email: registerDto.email,
        name: registerDto.name ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthService.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mocked-jwt-token',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const expectedUser = {
        ...mockUser,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      expect(response.body).toEqual({ user: expectedUser });
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('token=mocked-jwt-token');
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return 400 if extra fields are sent in register', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@example.com', password: 'Test123!@#', name: 'New User', extra: 'nope' })
        .expect(400);
    });
  });
});
