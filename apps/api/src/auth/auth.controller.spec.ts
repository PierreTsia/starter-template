import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('/auth/login (POST)', () => {
    it('should return access_token for valid credentials', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'Test123!@#' };
      mockAuthService.login.mockResolvedValue({ access_token: 'mocked-jwt-token' });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toEqual({ access_token: 'mocked-jwt-token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return 400 for invalid payload', async () => {
      const invalidLoginDto = { email: 'not-an-email', password: '' };
      await request(app.getHttpServer()).post('/auth/login').send(invalidLoginDto).expect(400);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('/auth/register (POST)', () => {
    it('should return user data for valid registration', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        password: 'Test123!@#',
        name: 'New User',
      };
      const mockUser = {
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
      };
      mockAuthService.register.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual(mockUser);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return 400 for invalid registration payload', async () => {
      const invalidRegisterDto = {
        email: 'bad',
        password: 'short',
        name: 'User',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });
});
