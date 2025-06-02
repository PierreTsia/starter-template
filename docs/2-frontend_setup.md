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

- [ ] Set up React

  - [ ] Install React and React DOM
  - [ ] Configure JSX support
  - [ ] Set up React Router
  - [ ] Configure error boundaries
  - [ ] Set up loading states
  - [ ] Configure toast notifications

- [ ] State Management

  - [ ] Install and configure Zustand
  - [ ] Set up store structure
  - [ ] Create basic auth store
  - [ ] Set up persistence middleware

- [ ] API Integration

  - [ ] Install and configure TanStack Query
  - [ ] Set up API client
  - [ ] Configure type-safe API calls
  - [ ] Set up query invalidation
  - [ ] Configure error handling
  - [ ] Set up optimistic updates

- [ ] Styling

  - [ ] Install and configure Tailwind CSS
  - [ ] Set up shadcn/ui components
  - [ ] Configure dark/light mode
  - [ ] Set up responsive design

- [ ] Development Tools

  - [ ] Configure ESLint and Prettier
  - [ ] Set up testing with Vitest and React Testing Library
  - [ ] Configure hot reload
  - [ ] Set up debugging tools

- [ ] Type Safety
  - [ ] Set up Zod for form validation
  - [ ] Configure type-safe API client
  - [ ] Set up type generation for API responses

## Environment Setup

- [ ] Create environment files
  - [ ] `.env.example`
  - [ ] `.env.local` (gitignored)
  - [ ] Environment variables validation
  - [ ] Configure Vercel deployment

## Basic App Implementation

- [ ] Create a basic page with routing in place
  - [ ] Set up protected routes
  - [ ] Configure route guards
  - [ ] Set up 404 page
- [ ] Integrate a few shadcn/ui components
  - [ ] Set up button component
  - [ ] Set up form components
  - [ ] Set up toast notifications
- [ ] Write a basic test using React Testing Library
  - [ ] Test component rendering
  - [ ] Test user interactions
  - [ ] Test API integration

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
- [ ] `pnpm install` works without errors
- [ ] Basic scripts run successfully
- [ ] ESLint and Prettier are properly configured
- [ ] Documentation is up to date
- [ ] A basic page is running with routing in place
- [ ] A few shadcn/ui components are integrated and functional
- [ ] A basic test using React Testing Library is passing
- [ ] State management is working with persistence
- [ ] API integration is working with type safety
- [ ] Error handling and loading states are in place
- [ ] Build process works for all environments

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
