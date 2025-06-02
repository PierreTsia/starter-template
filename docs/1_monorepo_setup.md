# Monorepo Setup Specification

## Overview
This document outlines the steps and requirements for setting up our monorepo structure. The goal is to create a solid foundation that will support both frontend and backend development while maintaining good developer experience.

## Prerequisites
- [x] Node.js 18+ installed
- [x] pnpm 8+ installed
- [x] Git installed
- [x] PostgreSQL installed (for local development)

## Directory Structure
- [x] Create root directory structure
  - [x] `apps/` for frontend and backend applications
  - [x] `packages/` for shared code
  - [x] `docs/` for documentation
  - [x] `.github/` for GitHub workflows

## Root Configuration
- [ ] Initialize Git repository
  - [ ] Create `.gitignore`
  - [ ] Initial commit

- [ ] Set up pnpm workspace
  - [ ] Create `pnpm-workspace.yaml`
  - [ ] Configure workspace packages

- [ ] Root `package.json`
  - [ ] Define workspace scripts
  - [ ] Set up development dependencies
  - [ ] Configure TypeScript
  - [ ] Set up ESLint and Prettier

## Development Tools Setup
- [ ] TypeScript Configuration
  - [ ] Create base `tsconfig.json`
  - [ ] Set up path aliases
  - [ ] Configure strict mode

- [ ] ESLint & Prettier
  - [ ] Install and configure ESLint
  - [ ] Set up Prettier
  - [ ] Create shared configs in `packages/eslint-config`

- [ ] Git Hooks
  - [ ] Set up Husky
  - [ ] Configure lint-staged
  - [ ] Add pre-commit hooks

## Environment Setup
- [ ] Create environment files
  - [ ] `.env.example`
  - [ ] `.env.local` (gitignored)
  - [ ] Environment variables validation

## Documentation
- [ ] Create README.md
  - [ ] Project overview
  - [ ] Setup instructions
  - [ ] Development workflow
  - [ ] Available scripts

## Definition of Done
The monorepo setup is considered complete when:
- [ ] All checkboxes above are checked
- [ ] `pnpm install` works without errors
- [ ] Basic scripts run successfully
- [ ] Git hooks are working
- [ ] ESLint and Prettier are properly configured
- [ ] Documentation is up to date

## Next Steps
After completing the monorepo setup, we will:
1. Set up the frontend application (Vite + React)
2. Set up the backend application (NestJS)
3. Configure the database (Prisma + PostgreSQL)

## Notes
- Keep the setup minimal but extensible
- Focus on developer experience
- Document any non-obvious decisions
- Consider future scalability 