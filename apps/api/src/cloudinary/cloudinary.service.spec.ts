import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';

import { LoggerService } from '../logger/logger.service';

import { CloudinaryException } from './cloudinary.exception';
import { CloudinaryService } from './cloudinary.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let loggerService: LoggerService;
  let configService: ConfigService;

  const createConfigService = (env: 'development' | 'production') => ({
    get: jest.fn((key: string): string | undefined => {
      const config: Record<string, string> = {
        CLOUDINARY_CLOUD_NAME: 'test-cloud',
        CLOUDINARY_API_KEY: 'test-key',
        CLOUDINARY_API_SECRET: 'test-secret',
        NODE_ENV: env,
      };
      return config[key];
    }),
  });

  const createTestingModule = async (env: 'development' | 'production' = 'development') => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: ConfigService,
          useValue: createConfigService(env),
        },
        {
          provide: LoggerService,
          useValue: { errorWithMetadata: jest.fn() },
        },
      ],
    }).compile();

    return {
      service: module.get<CloudinaryService>(CloudinaryService),
      loggerService: module.get<LoggerService>(LoggerService),
      configService: module.get<ConfigService>(ConfigService),
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await createTestingModule();
    service = module.service;
    loggerService = module.loggerService;
    configService = module.configService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should configure cloudinary with correct credentials', async () => {
      await createTestingModule();
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
      });
    });

    it('should set dev folder in development environment', async () => {
      await createTestingModule();
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });

    it('should set prod folder in production environment', async () => {
      await createTestingModule('production');
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });
  });

  describe('uploadImage', () => {
    const mockFile = {
      path: '/tmp/test-image.jpg',
    } as Express.Multer.File;

    const mockUploadResult = {
      secure_url: 'https://cloudinary.com/test-image.jpg',
      public_id: 'dev/avatars/test-image',
      version: '1234567890',
    };

    it('should upload image successfully', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResult);

      const result = await service.uploadImage(mockFile);

      expect(result).toEqual({
        url: mockUploadResult.secure_url,
        publicId: mockUploadResult.public_id,
        version: mockUploadResult.version,
      });
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFile.path, {
        folder: 'dev/avatars',
        resource_type: 'auto',
      });
    });

    it('should throw CloudinaryException on upload failure', async () => {
      const error = new Error('Upload failed');
      (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(error);

      await expect(service.uploadImage(mockFile)).rejects.toThrow(CloudinaryException);
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Failed to upload image',
        error,
        {
          path: mockFile.path,
          folder: 'dev/avatars',
        }
      );
    });
  });

  describe('deleteImage', () => {
    const mockPublicId = 'dev/avatars/test-image';

    it('should delete image successfully', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: 'ok' });

      await service.deleteImage(mockPublicId);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(mockPublicId);
    });

    it('should throw CloudinaryException on delete failure', async () => {
      const error = new Error('Delete failed');
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(error);

      await expect(service.deleteImage(mockPublicId)).rejects.toThrow(CloudinaryException);
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Failed to delete image',
        error,
        {
          publicId: mockPublicId,
          folder: 'dev/avatars',
        }
      );
    });
  });
});
