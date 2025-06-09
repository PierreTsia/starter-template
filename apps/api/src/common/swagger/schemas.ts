import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const AUTH_ERROR_RESPONSES = {
  INVALID_CREDENTIALS: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials or unconfirmed email',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.INVALID_CREDENTIALS',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Invalid email or password',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 401,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  EMAIL_EXISTS: {
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.EMAIL_EXISTS',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'A user with this email already exists',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 409,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  INVALID_TOKEN: {
    status: HttpStatus.NOT_FOUND,
    description: 'Invalid or expired token',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.INVALID_TOKEN',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Invalid token',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 404,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.TOKEN_EXPIRED',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Your session has expired. Please log in again',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 401,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
};

export const VALIDATION_ERROR_RESPONSES = {
  INVALID_EMAIL: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email format',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'VALIDATION.INVALID_EMAIL',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Please enter a valid email address',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 400,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  PASSWORD_TOO_SHORT: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid password format',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'VALIDATION.PASSWORD_TOO_SHORT',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Password must be at least 8 characters',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 400,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
};

// Helper function to create ApiResponse decorators
export const createApiResponse = (
  response: (typeof AUTH_ERROR_RESPONSES)[keyof typeof AUTH_ERROR_RESPONSES]
) => {
  return ApiResponse(response);
};

export const USER_ERROR_RESPONSES = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'USER.NOT_FOUND',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'User not found',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 404,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.UNAUTHORIZED',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Please log in to access this resource',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 401,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have permission',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'AUTH.FORBIDDEN',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'You do not have permission to perform this action',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 403,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
};

export const SYSTEM_ERROR_RESPONSES = {
  INTERNAL_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'SYSTEM.INTERNAL_ERROR',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'An unexpected error occurred',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 500,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
  SERVICE_UNAVAILABLE: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Service temporarily unavailable',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'SYSTEM.SERVICE_UNAVAILABLE',
          description: 'Error code for translation',
        },
        message: {
          type: 'string',
          example: 'Service is temporarily unavailable',
          description: 'Translated error message',
        },
        status: {
          type: 'number',
          example: 503,
        },
        meta: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              example: 'en',
            },
          },
        },
      },
    },
  },
};
