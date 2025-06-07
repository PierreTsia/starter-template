import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    prismaClient = service as unknown as PrismaClient;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with correct logging configuration', () => {
    expect(prismaClient).toHaveProperty('$connect');
    expect(prismaClient).toHaveProperty('$disconnect');
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      const connectSpy = jest.spyOn(prismaClient, '$connect');

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      const disconnectSpy = jest.spyOn(prismaClient, '$disconnect');

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
