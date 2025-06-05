import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true, // allow cookies/auth headers
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api/v1`);
}
bootstrap();
