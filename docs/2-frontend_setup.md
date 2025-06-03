# Frontend Setup Specification

## Overview

This document outlines the steps and requirements for setting up the frontend application using Vite and React. The goal is to create a solid foundation that supports modern development practices and integrates seamlessly with our monorepo.

## Directory Structure

- [x] Create frontend directory structure
  - [x] `apps/web/` for the Vite + React application
  - [x] `apps/web/src/` for source code
  - [x] `apps/web/public/` for static assets
  - [x] `apps/web/src/components/` for shared components
  - [x] `apps/web/src/features/` for feature-specific code
  - [x] `apps/web/src/lib/` for utilities and shared code
  - [x] `apps/web/src/types/` for TypeScript types
  - [x] `apps/web/src/hooks/` for custom hooks
  - [x] `apps/web/src/store/` for Zustand stores
  - [x] `apps/web/src/api/` for API client and queries

## Configuration

- [x] Initialize Vite project

  - [x] Create `vite.config.ts`
  - [x] Configure TypeScript
  - [x] Set up path aliases
  - [x] Configure build settings
  - [x] Set up development proxy
  - [x] Configure source maps
  - [x] Set up environment-specific builds

- [x] Set up React

  - [x] Install React and React DOM
  - [x] Configure JSX support
  - [x] Set up React Router
  - [x] Configure error boundaries
  - [x] Set up loading states / tanstack query
  - [x] setup tailwind css
  - [x] Configure toast notifications

- [x] State Management

  - [x] Install and configure Zustand (explored, then removed for simplicity)
  - [x] Set up store structure (handled via TanStack Query/localStorage)
  - [x] Create basic auth store (handled via TanStack Query/localStorage)
  - [x] Set up persistence middleware (localStorage for token)

- [x] API Integration

  - [x] Install and configure TanStack Query
  - [x] Set up API client
  - [x] Configure type-safe API calls
  - [x] Set up query invalidation
  - [x] Configure error handling
  - [ ] Set up optimistic updates

- [x] Styling

  - [x] Install and configure Tailwind CSS
  - [x] Set up shadcn/ui components (using CLI to copy components individually)
  - [x] Configure dark/light mode (support both system preference and manual toggle)
  - [x] Set up responsive design

- [x] Development Tools

  - [x] Configure ESLint and Prettier
  - [x] add a typecheck command
  - [x] Set up testing with Vitest and React Testing Library
  - [x] Configure hot reload
  - [x] Set up debugging tools (React Query Devtools)

- [x] Type Safety
  - [x] Set up Zod for form validation
  - [x] Configure type-safe API client

## Environment Setup

- [x] Create environment files
  - [x] `.env.example`
  - [x] `.env.local` (gitignored)
  - [x] Environment variables validation
  - [ ] Configure deployment (to be handled later)

## Basic App Implementation

- [x] Create a basic page with routing in place
  - [x] Set up protected routes
  - [x] Configure route guards
  - [x] Set up 404 page
- [x] Integrate a few shadcn/ui components
  - [x] Set up button component
  - [x] Set up form components
  - [x] Set up toast notifications
- [x] Write a basic test using React Testing Library
  - [x] Test component rendering
  - [x] Test user interactions
  - [x] Test API integration

## Documentation

- [ ] Update README.md
  - [ ] Frontend overview
  - [ ] Setup instructions
  - [ ] Available scripts
  - [ ] Component documentation
  - [ ] State management patterns
  - [ ] API integration guide

## Definition of Done

The frontend setup is considered complete when:

- [ ] All checkboxes above are checked
- [x] `pnpm install` works without errors
- [x] Basic scripts run successfully
- [x] ESLint and Prettier are properly configured
- [ ] Documentation is up to date
- [x] A basic page is running with routing in place
- [x] A few shadcn/ui components are integrated and functional
- [x] A basic test using React Testing Library is passing
- [x] State management is working with persistence
- [x] API integration is working with type safety
- [x] Error handling and loading states are in place
- [x] Build process works for all environments

## Next Steps

After completing the frontend setup, we will:

1. Set up the backend application (NestJS)
2. Configure the database (Prisma + PostgreSQL)

## Notes

- Keep the setup minimal but extensible
- Focus on developer experience
- Document any non-obvious decisions
- Consider future scalability
- Ensure type safety throughout the application
- Maintain consistent error handling
- Follow React best practices

[x] Configure ESLint and Prettier
[x] `pnpm install` works without errors
[x] ESLint and Prettier are properly configured
