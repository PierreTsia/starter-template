import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly folder: string;

  constructor(private readonly configService: ConfigService) {
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to upload image: ${errorMessage}`);
      throw error;
    }
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to delete image: ${errorMessage}`);
      throw error;
    }
  }
}
