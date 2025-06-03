# Full Stack Starter Template

![codecov](https://codecov.io/gh/PierreTsia/starter-template/branch/main/graph/badge.svg)](https://codecov.io/gh/PierreTsia/starter-template)

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

## Development Workflow

### Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Project Structure

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

### Git Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests and linting
4. Create a pull request

### Environment Variables

Required environment variables are validated at runtime. See `.env.example` for all required variables.

## Tech Stack

- **Frontend**: React 18, Vite, shadcn/ui, Tailwind CSS
- **Backend**: NestJS, Prisma, PostgreSQL
- **Tools**: TypeScript, ESLint, Prettier, Husky

## Frontend

The frontend is built with React and Vite, featuring:

- **Authentication**: JWT-based auth with protected routes
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui with Tailwind CSS
- **Type Safety**: Zod for runtime validation
- **Testing**: Vitest + React Testing Library

### Key Features

- Dark/Light mode support
- Responsive design
- Form validation
- Toast notifications
- Error boundaries

### Setup Instructions

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env.local` and adjust values
3. Start dev server: `pnpm dev`

### Available Scripts

- `pnpm dev` - Start frontend dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:cov` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
