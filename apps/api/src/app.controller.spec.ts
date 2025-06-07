import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';

describe('AppController', () => {
  let app: INestApplication;
  let controller: AppController;

  const mockAppService = {
    getHello: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    warnWithMetadata: jest.fn(),
    logWithMetadata: jest.fn(),

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
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<AppController>(AppController);
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('should redirect to health check endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(302)
        .expect('Location', '/api/v1/health');

      expect(response.redirect).toBe(true);
      expect(mockLoggerService.logWithMetadata).toHaveBeenCalledWith(
        'Root path accessed - redirecting to health check'
      );
    });
  });
});
