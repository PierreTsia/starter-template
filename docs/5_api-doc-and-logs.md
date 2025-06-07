# API Documentation & Logging Implementation Guide

This document outlines the steps and options for implementing API documentation (e.g., Swagger) and structured, informative server logs in your backend application.

---

## Checklist

### API Documentation

- [ ] Choose a documentation tool
  - [ ] Swagger (OpenAPI via NestJS @nestjs/swagger)
  - [ ] Redoc
  - [ ] Other (TBD)
- [ ] Install and configure the chosen tool
- [ ] Annotate controllers, DTOs, and endpoints with documentation decorators/comments
- [ ] Expose the API docs at a dedicated route (e.g., `/api/docs`)
- [ ] Secure the docs route (optional, e.g., only in non-production or behind auth)
- [ ] Keep docs up to date as the API evolves

### Server Logging

- [x] Choose a logging solution
  - [-] NestJS built-in Logger
  - [-] Winston (with @nestjs/winston)
  - [x] Pino (with @nestjs/pino)
  - [-] Other (TBD)
- [-] Implement a dedicated logging service (wraps or extends the chosen logger)
- [ ] Use structured logs (JSON, timestamps, log levels, context)
- [ ] Add informative logs to key events (requests, errors, auth, DB ops, etc.)
- [ ] Configure log output (console, file, external service)
- [ ] Set up log rotation and retention (if writing to files)
- [ ] Ensure logs do not leak sensitive data (scrub tokens, passwords, etc.)
- [ ] Add request correlation IDs for tracing (optional, but recommended)

---

## Example Implementation Steps

### API Documentation

1. **Install Swagger module:**
   - `pnpm add @nestjs/swagger swagger-ui-express`
2. **Configure Swagger in `main.ts`:**
   - Set up SwaggerModule, document your API, and expose at `/api/docs`.
3. **Annotate controllers and DTOs:**
   - Use decorators like `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, etc.
4. **Secure docs route (optional):**
   - Only enable in development, or protect with auth.

### Logging

1. **Choose and install a logger:**
   - For Winston: `pnpm add winston @nestjs/winston`
   - For Pino: `pnpm add pino @nestjs/pino`
2. **Create a logging service:**
   - Wrap the logger, add context, and expose methods for different log levels.
3. **Replace `console.log`/`console.error` with logger calls:**
   - Use `logger.log()`, `logger.error()`, etc., throughout your app.
4. **Configure log output:**
   - Console for dev, file or external service for prod.
5. **Add request IDs/correlation IDs (optional):**
   - Use middleware/interceptor to attach a unique ID to each request and include it in logs.

---

## Definition of Done

The API documentation and logging setup is considered complete when:

- [ ] All required checkboxes above are checked
- [ ] API documentation is available, accurate, and up to date at `/api/docs`
- [ ] Server logs are structured, informative, and do not leak sensitive data
- [ ] Logs are accessible and useful for debugging and monitoring
- [ ] (Optional) Request correlation IDs are present in logs for tracing

---

**This doc is your checklist and reference for implementing robust API documentation and logging in your backend.**

## Detailed Logging Implementation Plan

### 1. Authentication & Authorization

- **AuthController**:

  - ✅ Login attempts (success/failure)
  - ✅ Logout events
  - ✅ Token refresh attempts
  - ❌ Password reset requests (NOT IMPLEMENTED)
  - ✅ Registration attempts

- **AuthService**:
  - ✅ Token generation
  - ✅ Token validation
  - ✅ Password hashing operations
  - ✅ User verification steps
  - ✅ whoami endpoint

### 2. User Management

- **UsersController**:

  - ✅ User creation
  - ✅ User updates
  - ✅ User deletion
  - ✅ Profile updates
  - ✅ Password changes (handled in AuthService)

- **UsersService**:
  - Database operations
  - Data validation results
  - Cache operations (if any)

### 3. Database Operations (Prisma)

- **PrismaService**:
  - Connection events
  - Query execution times
  - Transaction starts/completions
  - Migration events

### 4. Error Handling

- **AllExceptionsFilter**:

  - Unhandled exceptions
  - Error stack traces
  - Error context

- **ValidationExceptionFilter**:

  - Validation failures
  - Invalid input data

- **PrismaExceptionFilter**:
  - Database errors
  - Connection issues
  - Query failures

### 5. Request/Response Lifecycle

- **Global Interceptors**:
  - Request start/end
  - Response times
  - Request sizes
  - Response sizes

### 6. Health Checks

- **HealthController**:
  - Health check requests
  - System status changes
  - Dependency status (DB, cache, etc.)

### 7. Application Lifecycle

- **main.ts**:
  - Application startup
  - Configuration loading
  - Environment detection
  - Port binding

### 8. Security Events

- **Rate Limiting**:

  - Rate limit hits
  - IP blocking events

- **CORS**:
  - Cross-origin request attempts
  - CORS policy violations

### 9. Performance Monitoring

- **Cache Operations**:

  - Cache hits/misses
  - Cache invalidation

- **External Service Calls**:
  - API calls
  - Response times
  - Failures

### 10. Business Logic

- **Business Services**:
  - Important state changes
  - Business rule validations
  - Critical operations

### Implementation Priority Order

1. Authentication (security-critical)
2. Error handling (debugging-critical)
3. Database operations (performance-critical)
4. Request/Response lifecycle (monitoring-critical)
5. Health checks and application lifecycle
6. Security events
7. Performance monitoring
8. Business logic
9. User management
10. Other areas

### Log Structure Template

```typescript
{
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  context: string;
  message: string;
  correlationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  duration?: number; // for performance metrics
}
```
