import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);

    // Mock response object
    mockResponse = {
      redirect: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('root', () => {
    it('should redirect to health check endpoint', () => {
      appController.getRoot(mockResponse as Response);
      expect(mockResponse.redirect).toHaveBeenCalledWith(302, '/api/v1/health');
    });
  });
});
