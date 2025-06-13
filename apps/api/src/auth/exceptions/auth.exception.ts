import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '../../errors/codes';
import { messageResolver } from '../../errors/message-resolver';
import { ApiError } from '../../errors/types';

export class AuthException extends HttpException {
  constructor(error: ApiError) {
    super(error, error.status);
  }

  static userNotFound(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.USER_NOT_FOUND,
      message: messageResolver.resolve(ErrorCodes.AUTH.USER_NOT_FOUND, acceptLanguage),
      status: HttpStatus.UNAUTHORIZED,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static invalidCredentials(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.INVALID_CREDENTIALS,
      message: messageResolver.resolve(ErrorCodes.AUTH.INVALID_CREDENTIALS, acceptLanguage),
      status: HttpStatus.UNAUTHORIZED,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static emailNotConfirmed(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED,
      message: messageResolver.resolve(ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED, acceptLanguage),
      status: HttpStatus.UNAUTHORIZED,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static emailAlreadyExists(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS,
      message: messageResolver.resolve(ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS, acceptLanguage),
      status: HttpStatus.CONFLICT,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static emailAlreadyConfirmed(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.EMAIL_ALREADY_CONFIRMED,
      message: messageResolver.resolve(ErrorCodes.AUTH.EMAIL_ALREADY_CONFIRMED, acceptLanguage),
      status: HttpStatus.CONFLICT,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static invalidToken(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.INVALID_TOKEN,
      message: messageResolver.resolve(ErrorCodes.AUTH.INVALID_TOKEN, acceptLanguage),
      status: HttpStatus.UNAUTHORIZED,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static tokenExpired(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.TOKEN_EXPIRED,
      message: messageResolver.resolve(ErrorCodes.AUTH.TOKEN_EXPIRED, acceptLanguage),
      status: HttpStatus.UNAUTHORIZED,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }

  static newPasswordSameAsCurrent(acceptLanguage?: string): AuthException {
    const error: ApiError = {
      code: ErrorCodes.AUTH.NEW_PASSWORD_SAME_AS_CURRENT,
      message: messageResolver.resolve(
        ErrorCodes.AUTH.NEW_PASSWORD_SAME_AS_CURRENT,
        acceptLanguage
      ),
      status: HttpStatus.BAD_REQUEST,
      meta: {
        language: messageResolver.parseAcceptLanguage(acceptLanguage),
      },
    };
    return new AuthException(error);
  }
}
