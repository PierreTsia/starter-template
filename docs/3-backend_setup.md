# Backend Setup Specification

## Overview

This document outlines the steps and requirements for setting up the backend application using NestJS and PostgreSQL. The goal is to create a solid foundation that supports modern development practices and integrates seamlessly with our monorepo.

## Directory Structure

- [x] Create backend directory structure
  - [x] `apps/api/` for the NestJS application
  - [x] `apps/api/src/` for source code
  - [x] `apps/api/src/auth/` for authentication module
  - [x] `apps/api/src/users/` for user management
  - [x] `apps/api/src/common/` for shared code
  - [x] `apps/api/prisma/` for database schema and migrations
  - [x] `apps/api/test/` for test files

## Configuration

- [x] Initialize NestJS project

  - [x] Create `nest-cli.json`
  - [x] Configure TypeScript
  - [x] Set up path aliases
  - [x] Configure build settings
  - [x] Set up development settings
  - [x] Configure source maps

- [x] Set up Database

  - [x] Install and configure Prisma
  - [x] Set up PostgreSQL connection
  - [x] Create initial schema
  - [x] Set up migrations
  - [ ] Configure database seeding

- [ ] Authentication Setup

  - [ ] Install required packages (passport, jwt)
  - [ ] Configure JWT strategy
  - [ ] Set up refresh token mechanism
  - [ ] Create auth guards
  - [ ] Implement login/register endpoints

- [x] API Structure

  - [x] Set up controllers
  - [x] Create DTOs
  - [x] Implement services
  - [x] Set up validation pipes
  - [x] Configure CORS

- [x] Development Tools
  - [x] Configure ESLint and Prettier
  - [x] Set up testing with Jest
  - [x] Configure hot reload
  - [x] Set up debugging tools

## Environment Setup

- [x] Create environment files
  - [x] `.env.example`
  - [x] `.env.local` (gitignored)
  - [x] Environment variables validation
  - [ ] Configure deployment settings

## Basic API Implementation

- [x] Create basic endpoints
  - [x] Public GET endpoint
  - [x] User CRUD endpoints
    - [x] GET /api/v1/users (list users)
    - [x] GET /api/v1/users/:id (get user by id)
    - [x] POST /api/v1/users (create user)
    - [x] PATCH /api/v1/users/:id (update user)
    - [x] DELETE /api/v1/users/:id (delete user)
  - [ ] Login endpoint
  - [ ] Register endpoint
  - [ ] WhoAmI endpoint (protected)
- [x] Set up error handling
  - [x] Global exception filter
  - [x] Validation pipe
  - [x] Custom exceptions
- [x] Write basic tests
  - [x] Test endpoint responses
  - [ ] Test authentication
  - [ ] Test validation

## Documentation

- [ ] Update README.md
  - [ ] Backend overview
  - [ ] Setup instructions
  - [ ] Available scripts
  - [ ] API documentation

## Definition of Done

The backend setup is considered complete when:

- [ ] All required checkboxes above are checked
- [x] `pnpm install` works without errors
- [x] Basic scripts run successfully
- [x] ESLint and Prettier are properly configured
- [ ] Documentation is up to date
- [x] Basic endpoints are working
- [ ] Authentication flow is functional
- [x] Database migrations work
- [ ] Tests are passing
- [ ] Build process works for all environments

## Next Steps

After completing the backend setup, we will:

1. Connect frontend and backend
2. Implement the todo feature
3. Set up CI/CD pipelines

## Notes

- Keep the setup minimal but extensible
- Focus on developer experience
- Document any non-obvious decisions
- Consider future scalability
- Ensure type safety throughout the application
- Maintain consistent error handling
- Follow NestJS best practices
