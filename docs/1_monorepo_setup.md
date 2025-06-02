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

- [x] Initialize Git repository

  - [x] Create `.gitignore`
  - [x] Initial commit

- [x] Set up pnpm workspace

  - [x] Create `pnpm-workspace.yaml`
  - [x] Configure workspace packages

- [x] Root `package.json`
  - [x] Define workspace scripts
  - [x] Set up development dependencies
  - [ ] Configure TypeScript
  - [ ] Set up ESLint and Prettier

## Development Tools Setup

- [x] TypeScript Configuration

  - [x] Create base `tsconfig.json`
  - [x] Set up path aliases
  - [x] Configure strict mode
  - [x] Create shared configs in `packages/tsconfig`

- [x] ESLint & Prettier

  - [x] Install and configure ESLint
  - [x] Set up Prettier
  - [x] Create shared configs in `packages/eslint-config`

- [x] Git Hooks
  - [x] Set up Husky
  - [x] Configure lint-staged
  - [x] Add pre-commit hooks

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
