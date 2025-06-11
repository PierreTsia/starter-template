import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { LoggerService } from '../logger/logger.service';

import { CloudinaryException } from './cloudinary.exception';

@Injectable()
export class CloudinaryService {
  private readonly folder: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    this.folder =
      this.configService.get('NODE_ENV') === 'production' ? 'prod/avatars' : 'dev/avatars';
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: this.folder,
        resource_type: 'auto',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        version: result.version,
      };
    } catch (error: unknown) {
      this.logger.errorWithMetadata(
        'Failed to upload image',
        error instanceof Error ? error : new Error('Unknown error'),
        {
          path: file.path,
          folder: this.folder,
        }
      );
      throw CloudinaryException.uploadFailed();
    }
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: unknown) {
      this.logger.errorWithMetadata(
        'Failed to delete image',
        error instanceof Error ? error : new Error('Unknown error'),
        {
          publicId,
          folder: this.folder,
        }
      );
      throw CloudinaryException.deleteFailed();
    }
  }
}
