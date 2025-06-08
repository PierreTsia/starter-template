import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        DATABASE_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASS: Joi.string().required(),
        SMTP_FROM_EMAIL: Joi.string().email().required(),
      }),
      validationOptions: {
        abortEarly: true,
        allowUnknown: false,
      },
    }),
  ],
})
export class ConfigModule {}
