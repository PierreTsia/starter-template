import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
  ExecutionContext,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from '@prisma/client';
import { Request } from 'express';
import * as request from 'supertest';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshTokenService } from './refresh-token.service';

interface RequestWithUser extends Request {
  user: User;
}

interface ValidationErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailConfirmationToken: null,
    isEmailConfirmed: true,
    passwordResetExpires: null,
    passwordResetToken: null,
    emailConfirmationExpires: null,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=default',
  };

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      validateUser: jest.fn(),
      generateJwt: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      updatePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 3600,
            limit: 3,
          },
        ]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
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
        {
          provide: RefreshTokenService,
          useValue: {
            validateRefreshToken: jest.fn().mockResolvedValue({ userId: '1' }),
          },
        },
        Logger,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest<RequestWithUser>();
          request.user = mockUser;
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );
    await app.init();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      expect(response.body).toEqual({ user: expectedUser, token: 'mocked-jwt-token' });
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
        password: 'Password123!',
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

      expect(response.body).toEqual({ user: expectedUser, token: 'mocked-jwt-token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return 400 if password is too short', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.com', password: 'pass123', name: 'New User' })
        .expect(400);
    });

    it('should return 400 if password does not contain uppercase letter', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.com', password: 'password123', name: 'New User' })
        .expect(400);
    });

    it('should return 400 if extra fields are sent in register', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@example.com', password: 'Test123!@#', name: 'New User', extra: 'nope' })
        .expect(400);
    });

    it('should return 400 if password does not contain a number', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.com', password: 'Password!', name: 'New User' })
        .expect(400);
    });

    it('should return 400 if password does not contain a special character', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@test.com', password: 'Password123', name: 'New User' })
        .expect(400);
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
        },
        token: 'new-jwt-token',
      };
      (mockAuthService.refreshTokens as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer valid-refresh-token')
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith('Bearer valid-refresh-token');
    });

    it('should return 401 when no refresh token is provided', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });

    it('should return 401 when refresh token is invalid', async () => {
      (mockAuthService.refreshTokens as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid refresh token')
      );

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout successfully with valid refresh token', async () => {
      (mockAuthService.logout as jest.Mock).mockResolvedValue({ success: true });

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-refresh-token')
        .expect(200);

      expect(response.body).toEqual({ success: true });
      expect(mockAuthService.logout).toHaveBeenCalledWith('Bearer valid-refresh-token');
    });

    it('should return 401 when no refresh token is provided', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('should return 401 when refresh token is invalid', async () => {
      (mockAuthService.logout as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid refresh token')
      );

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/password (PUT)', () => {
    it('should update password successfully', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'password123',
        newPassword: 'newPassword123!',
      };

      (mockAuthService.updatePassword as jest.Mock).mockResolvedValue({
        message: 'Password updated successfully',
      });

      const response = await request(app.getHttpServer())
        .put('/auth/password')
        .set('Authorization', 'Bearer valid-access-token')
        .set('accept-language', 'en')
        .send(updatePasswordDto)
        .expect(200);

      expect(response.body).toEqual({ message: 'Password updated successfully' });
      expect(mockAuthService.updatePassword).toHaveBeenCalledWith('1', updatePasswordDto, 'en');
    });

    it('should return 400 when current password is empty', async () => {
      const invalidDto = {
        currentPassword: '',
        newPassword: 'newPassword123!',
      };

      const response = await request(app.getHttpServer())
        .put('/auth/password')
        .set('Authorization', 'Bearer valid-access-token')
        .send(invalidDto)
        .expect(400);

      const errorResponse = response.body as ValidationErrorResponse;
      expect(errorResponse.message).toContain('currentPassword should not be empty');
    });

    it('should return 400 when new password is too short', async () => {
      const invalidDto = {
        currentPassword: 'currentPassword123',
        newPassword: 'short',
      };

      const response = await request(app.getHttpServer())
        .put('/auth/password')
        .set('Authorization', 'Bearer valid-access-token')
        .send(invalidDto)
        .expect(400);

      const errorResponse = response.body as ValidationErrorResponse;
      expect(errorResponse.message).toContain(
        'newPassword must be longer than or equal to 8 characters'
      );
    });

    it('should return 400 when new password does not match pattern', async () => {
      const invalidDto = {
        currentPassword: 'currentPassword123',
        newPassword: 'password123', // Missing uppercase and special char
      };

      const response = await request(app.getHttpServer())
        .put('/auth/password')
        .set('Authorization', 'Bearer valid-access-token')
        .send(invalidDto)
        .expect(400);

      const errorResponse = response.body as ValidationErrorResponse;
      expect(errorResponse.message).toContain(
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    });
  });
});
