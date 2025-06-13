import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Enable CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Enable cookie parsing
  app.use(cookieParser());

  // Set global prefix for all routes except root
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'api/docs'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitive types
      },
    })
  );

  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationExceptionFilter());

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
