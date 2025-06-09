import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '../../errors/codes';
import { messageResolver } from '../../errors/message-resolver';
import { ApiError } from '../../errors/types';

export class UserException extends HttpException {
  constructor(error: ApiError) {
    super(error, error.status);
  }

  static notFound(id: string, acceptLanguage?: string): UserException {
    const error: ApiError = {
      code: ErrorCodes.DATABASE.RECORD_NOT_FOUND,
      message: messageResolver.resolve(ErrorCodes.DATABASE.RECORD_NOT_FOUND, acceptLanguage, {
        id,
      }),
      status: HttpStatus.NOT_FOUND,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new UserException(error);
  }

  static invalidEmail(acceptLanguage?: string): UserException {
    const error: ApiError = {
      code: ErrorCodes.DATABASE.UNIQUE_CONSTRAINT_VIOLATION,
      message: messageResolver.resolve(
        ErrorCodes.DATABASE.UNIQUE_CONSTRAINT_VIOLATION,
        acceptLanguage
      ),
      status: HttpStatus.CONFLICT,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new UserException(error);
  }
}
