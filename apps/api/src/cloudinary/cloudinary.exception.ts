import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '../errors/codes';
import { messageResolver } from '../errors/message-resolver';
import { ApiError } from '../errors/types';

export class CloudinaryException extends HttpException {
  constructor(error: ApiError) {
    super(error, error.status);
  }

  static uploadFailed(acceptLanguage?: string): CloudinaryException {
    const error: ApiError = {
      code: ErrorCodes.CLOUDINARY.UPLOAD_FAILED,
      message: messageResolver.resolve(ErrorCodes.CLOUDINARY.UPLOAD_FAILED, acceptLanguage),
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new CloudinaryException(error);
  }

  static deleteFailed(acceptLanguage?: string): CloudinaryException {
    const error: ApiError = {
      code: ErrorCodes.CLOUDINARY.DELETE_FAILED,
      message: messageResolver.resolve(ErrorCodes.CLOUDINARY.DELETE_FAILED, acceptLanguage),
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new CloudinaryException(error);
  }

  static invalidFile(acceptLanguage?: string): CloudinaryException {
    const error: ApiError = {
      code: ErrorCodes.CLOUDINARY.INVALID_FILE,
      message: messageResolver.resolve(ErrorCodes.CLOUDINARY.INVALID_FILE, acceptLanguage),
      status: HttpStatus.BAD_REQUEST,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new CloudinaryException(error);
  }
}
