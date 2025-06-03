# Full Stack Starter Template PRD

## Overview

A minimal but production-ready monorepo template for full-stack TypeScript applications. Designed to be cloned and extended for new projects, with a focus on developer experience and best practices.

## Core Features

### 1. Authentication System

- JWT-based auth with refresh tokens (kept for security best practices)
- Protected routes (both FE and BE)
- Basic user management (register, login, logout)
- Session persistence
- Password reset flow (optional)

### 2. Todo List Feature (Minimal Implementation)

- CRUD operations for todos
- Basic filtering (all, active, completed)
- Optimistic updates
- Real-time sync between tabs (optional)

### 3. UI Components (shadcn/ui)

- Dark/light mode
- Responsive layout
- Loading states
- Error boundaries
- Toast notifications
- Form components with validation

## Technical Stack

### Frontend

```typescript
// Core
- React 18+ with TypeScript
- Vite (faster than CRA, better DX)
- React Router v6
- TanStack Query (formerly React Query)
- Zustand (simpler than Redux for most cases)

// UI & Styling
- shadcn/ui (built on Radix UI)
- Tailwind CSS
- clsx/tw-merge for conditional classes
- React Hook Form + Zod for forms

// Testing
- Vitest + React Testing Library
- MSW for API mocking
```

### Backend

```typescript
// Core
- NestJS (TypeScript) - kept for structure and best practices
- Prisma (type-safe ORM)
- PostgreSQL
- JWT for auth
- Class Validator/Transformer

// Testing
- Jest
- Supertest
```

## Must-Have Features

### 1. Development Experience

- Hot reload for both FE and BE
- TypeScript strict mode
- ESLint + Prettier
- Husky + lint-staged
- Path aliases configured
- Environment variables validation

### 2. Testing Setup

- Unit tests for core business logic
- Basic API endpoint tests
- Test coverage reporting (optional)

### 3. Security

- CORS configuration
- Input validation
- XSS protection
- Secure headers
- Environment variables (.env)

### 4. Error Handling

- Global error boundary
- API error handling
- Basic logging

## Deployment Strategy

### Frontend (Vercel)

```bash
# Why Vercel?
- Zero config deployments
- Automatic preview deployments
- Great DX with GitHub integration
- Free tier is generous
```

### Backend & Database (Render)

```bash
# Why Render?
- Simple deployment process
- Managed PostgreSQL included
- Free tier available
- Good performance
- Easy environment management
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# Core Workflows
1. PR Checks
- Lint
- Type check
- Unit tests
- Build verification

2. Deployment
- Production on main branch
- Database migrations
- Environment sync
```

## Project Structure

```
starter-template/
├── apps/
│   ├── web/                 # Frontend
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/                 # Backend
│       ├── src/
│       ├── prisma/
│       └── package.json
│
├── packages/               # Shared code
│   ├── eslint-config/     # Shared ESLint config
│   ├── tsconfig/         # Shared TypeScript config
│   └── ui/               # Shared UI components
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│
├── docker-compose.yml    # Local development
├── package.json         # Root package.json
└── README.md
```

## Getting Started Guide

1. **Local Development**

```bash
# Clone and setup
git clone <repo>
pnpm install
cp .env.example .env

# Start development
pnpm dev
```

2. **Deployment**

```bash
# Frontend
- Connect Vercel to GitHub
- Configure environment variables
- Deploy

# Backend
- Connect Render to GitHub
- Set up PostgreSQL
- Configure environment variables
- Deploy
```

## Success Metrics

- Build time < 2 minutes
- Development setup time < 5 minutes
- Zero critical security issues
- Maintainable codebase

## Future Considerations

- Docker support for local development
- API documentation with Swagger
- Analytics setup (if needed)
- i18n support (if needed)

This template is designed to be practical for side projects while maintaining good development practices. It includes essential features and tools while avoiding unnecessary complexity. The todo list feature serves as a practical example of how to implement common patterns that you'll need in most applications.
