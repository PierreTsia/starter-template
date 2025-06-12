import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

import { LoggerService } from '../logger/logger.service';

import { CloudinaryException } from './cloudinary.exception';

@Injectable()
export class CloudinaryService {
  private readonly folder: string;
  private projectName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    this.projectName = this.configService.get('PROJECT_NAME') || 'default';

    this.folder =
      this.configService.get('NODE_ENV') === 'production'
        ? `${this.projectName}/prod/avatars`
        : `${this.projectName}/dev/avatars`;
  }

  async uploadImage(file: Express.Multer.File, userId: string, acceptLanguage?: string) {
    try {
      // Validate file type
      const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!supportedMimeTypes.includes(file.mimetype)) {
        this.logger.errorWithMetadata(
          'Invalid file type for upload',
          new Error(`Unsupported mimetype: ${file.mimetype}`),
          {
            path: file.path,
            mimetype: file.mimetype,
          }
        );
        throw CloudinaryException.invalidFile(acceptLanguage);
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.logger.errorWithMetadata(
          'File too large for upload',
          new Error(`File size: ${file.size} bytes`),
          {
            path: file.path,
            size: file.size,
          }
        );
        throw CloudinaryException.invalidFile(acceptLanguage);
      }

      // Validate file content (basic check)
      if (!file.buffer && !file.path) {
        this.logger.errorWithMetadata('Invalid file content', new Error('No file content found'), {
          path: file.path,
        });
        throw CloudinaryException.invalidFile(acceptLanguage);
      }

      const timestamp = Date.now();
      const publicId = `${this.folder}/${userId}/avatar-${timestamp}`;

      const result = await cloudinary.uploader.upload(file.path, {
        public_id: publicId,
        resource_type: 'auto',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        version: result.version,
      };
    } catch (error: unknown) {
      // If it's already a CloudinaryException, rethrow it
      if (error instanceof CloudinaryException) {
        throw error;
      }

      // For any other error, log and throw generic error
      this.logger.errorWithMetadata('Failed to upload image', error as Error, {
        path: file.path,
        folder: this.folder,
      });
      throw CloudinaryException.uploadFailed(acceptLanguage);
    } finally {
      // Clean up the temporary file
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            this.logger.errorWithMetadata('Failed to delete temporary file', err, {
              filePath: file.path,
            });
          }
        });
      }
    }
  }

  async deleteImage(publicId: string, acceptLanguage?: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: unknown) {
      this.logger.errorWithMetadata('Failed to delete image from Cloudinary', error as Error, {
        publicId,
        folder: this.folder,
      });
      throw CloudinaryException.deleteFailed(acceptLanguage);
    }
  }

  extractPublicIdFromUrl(url: string): string | null {
    try {
      return extractPublicId(url);
    } catch (error: unknown) {
      this.logger.errorWithMetadata('Failed to extract publicId from URL', error as Error, {
        url,
      });
      return null;
    }
  }
}
