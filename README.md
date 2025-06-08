# Full Stack Starter Template

[![codecov](https://codecov.io/gh/PierreTsia/starter-template/branch/main/graph/badge.svg)](https://codecov.io/gh/PierreTsia/starter-template)

A production-ready monorepo template for full-stack TypeScript applications. Built with React, NestJS, and PostgreSQL.

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env.local

# Start development servers
pnpm dev
```

## Project Structure

```
starter-template/
├── apps/
│   ├── web/          # Frontend (Vite + React)
│   └── api/          # Backend (NestJS)
├── packages/         # Shared code
│   ├── eslint-config/
│   ├── tsconfig/
│   └── ui/
└── docs/            # Documentation
```

## Backend (NestJS)

- **Tech:** NestJS, Prisma, PostgreSQL, Passport/JWT
- **Features:**
  - User CRUD (protected by JWT)
  - Auth (register, login, whoami, guards)
  - Email confirmation and password reset flow
  - DTO validation, global error handling
  - Test coverage with Jest
  - Ready for deployment (see docs/6_back-end-deployment-setup.md)
- **Email Service:**
  - Uses Brevo (formerly Sendinblue) for transactional emails
  - Development: Mailtrap for email testing
  - Production: Requires verified sender email and domain
- **Setup:**
  1. `cd apps/api`
  2. `pnpm install`
  3. Copy `.env.example` to `.env.local` and set DB/JWT secrets
  4. `pnpm prisma migrate deploy` (or `prisma migrate dev` for local)
  5. `pnpm dev` (or `pnpm start:prod` for production)
- **Scripts:**
  - `pnpm dev` - Start backend in dev mode
  - `pnpm build` - Build backend
  - `pnpm start:prod` - Start backend in production
  - `pnpm test` - Run backend tests
  - `pnpm lint` - Lint backend code
- **Docs:**
  - [Backend setup](docs/3-backend_setup.md)
  - [Refresh token guide](docs/4_refresh-token.md)
  - [API docs & logging](docs/5_api-doc-and-logs.md)
  - [Deployment guide](docs/6_back-end-deployment-setup.md)

## Frontend (React + Vite)

- **Tech:** React 18, Vite, shadcn/ui, Tailwind CSS, TanStack Query
- **Features:**
  - JWT auth, protected routes
  - Type-safe API client, Zod validation
  - Responsive UI, dark/light mode
  - Toast notifications, error boundaries
- **Setup:**
  1. `cd apps/web`
  2. `pnpm install`
  3. Copy `.env.example` to `.env.local`
  4. `pnpm dev`
- **Scripts:**
  - `pnpm dev` - Start frontend dev server
  - `pnpm build` - Build for production
  - `pnpm preview` - Preview production build
  - `pnpm test` - Run tests
  - `pnpm lint` - Lint code
  - `pnpm typecheck` - TypeScript check

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
