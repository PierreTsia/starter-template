# Full Stack Starter Template

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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
