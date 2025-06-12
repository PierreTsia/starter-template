import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';

import { LoggerService } from '../logger/logger.service';

import { CloudinaryException } from './cloudinary.exception';
import { CloudinaryService } from './cloudinary.service';

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

// Mock cloudinary-build-url
const mockExtractPublicId = jest.fn<string | null, [string]>();
jest.mock('cloudinary-build-url', () => ({
  extractPublicId: (url: string): string | null => mockExtractPublicId(url),
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
        PROJECT_NAME: 'test-project',
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

    // Mock extractPublicId implementation
    mockExtractPublicId.mockImplementation((url: string) => {
      if (url.includes('cloudinary.com')) {
        return 'test-image';
      }
      throw new Error('Invalid URL');
    });
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
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      buffer: Buffer.from('fake-image-data'),
    } as Express.Multer.File;

    const mockUploadResult = {
      secure_url: 'https://cloudinary.com/test-image.jpg',
      public_id: 'test-project/dev/avatars/test-image',
      version: '1234567890',
    };

    const mockUserId = '123';

    it('should upload image successfully', async () => {
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResult);

      const result = await service.uploadImage(mockFile, mockUserId);

      expect(result).toEqual({
        url: mockUploadResult.secure_url,
        publicId: mockUploadResult.public_id,
        version: mockUploadResult.version,
      });
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFile.path, {
        public_id: expect.stringMatching(
          /^test-project\/dev\/avatars\/123\/avatar-\d{13}$/
        ) as string,
        resource_type: 'auto',
      });
    });

    it('should throw CloudinaryException on invalid file type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      await expect(service.uploadImage(invalidFile, mockUserId)).rejects.toThrow(
        CloudinaryException
      );
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Invalid file type for upload',
        expect.any(Error),
        {
          path: invalidFile.path,
          mimetype: invalidFile.mimetype,
        }
      );
    });

    it('should throw CloudinaryException on file too large', async () => {
      const largeFile = {
        ...mockFile,
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      await expect(service.uploadImage(largeFile, mockUserId)).rejects.toThrow(CloudinaryException);
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'File too large for upload',
        expect.any(Error),
        {
          path: largeFile.path,
          size: largeFile.size,
        }
      );
    });

    it('should throw CloudinaryException on upload failure', async () => {
      const error = new Error('Upload failed');
      (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(error);

      await expect(service.uploadImage(mockFile, mockUserId)).rejects.toThrow(CloudinaryException);
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Failed to upload image',
        error,
        {
          path: mockFile.path,
          folder: 'test-project/dev/avatars',
        }
      );
    });
  });

  describe('deleteImage', () => {
    const mockPublicId = 'test-project/dev/avatars/test-image';

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
        'Failed to delete image from Cloudinary',
        error,
        {
          publicId: mockPublicId,
          folder: 'test-project/dev/avatars',
        }
      );
    });
  });

  describe('extractPublicIdFromUrl', () => {
    it('should return public ID when URL is valid', () => {
      const url = 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-image.jpg';
      const result = service.extractPublicIdFromUrl(url);
      expect(result).toBe('test-image');
    });

    it('should return null and log error when URL is invalid', () => {
      const url = 'invalid-url';
      const result = service.extractPublicIdFromUrl(url);
      expect(result).toBeNull();
      expect(loggerService.errorWithMetadata).toHaveBeenCalledWith(
        'Failed to extract publicId from URL',
        expect.any(Error),
        { url }
      );
    });
  });
});
