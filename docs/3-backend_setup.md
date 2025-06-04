# Backend Setup Specification

## Overview

This document outlines the steps and requirements for setting up the backend application using NestJS and PostgreSQL. The goal is to create a solid foundation that supports modern development practices and integrates seamlessly with our monorepo.

## Directory Structure

- [ ] Create backend directory structure
  - [ ] `apps/api/` for the NestJS application
  - [ ] `apps/api/src/` for source code
  - [ ] `apps/api/src/auth/` for authentication module
  - [ ] `apps/api/src/users/` for user management
  - [ ] `apps/api/src/common/` for shared code
  - [ ] `apps/api/prisma/` for database schema and migrations
  - [ ] `apps/api/test/` for test files

## Configuration

- [ ] Initialize NestJS project

  - [ ] Create `nest-cli.json`
  - [ ] Configure TypeScript
  - [ ] Set up path aliases
  - [ ] Configure build settings
  - [ ] Set up development settings
  - [ ] Configure source maps

- [ ] Set up Database

  - [ ] Install and configure Prisma
  - [ ] Set up PostgreSQL connection
  - [ ] Create initial schema
  - [ ] Set up migrations
  - [ ] Configure database seeding

- [ ] Authentication Setup

  - [ ] Install required packages (passport, jwt)
  - [ ] Configure JWT strategy
  - [ ] Set up refresh token mechanism
  - [ ] Create auth guards
  - [ ] Implement login/register endpoints

- [ ] API Structure

  - [ ] Set up controllers
  - [ ] Create DTOs
  - [ ] Implement services
  - [ ] Set up validation pipes
  - [ ] Configure CORS

- [ ] Development Tools
  - [ ] Configure ESLint and Prettier
  - [ ] Set up testing with Jest
  - [ ] Configure hot reload
  - [ ] Set up debugging tools

## Environment Setup

- [ ] Create environment files
  - [ ] `.env.example`
  - [ ] `.env.local` (gitignored)
  - [ ] Environment variables validation
  - [ ] Configure deployment settings

## Basic API Implementation

- [ ] Create basic endpoints
  - [ ] Public GET endpoint
  - [ ] Login endpoint
  - [ ] Register endpoint
  - [ ] WhoAmI endpoint (protected)
- [ ] Set up error handling
  - [ ] Global exception filter
  - [ ] Validation pipe
  - [ ] Custom exceptions
- [ ] Write basic tests
  - [ ] Test endpoint responses
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
- [ ] `pnpm install` works without errors
- [ ] Basic scripts run successfully
- [ ] ESLint and Prettier are properly configured
- [ ] Documentation is up to date
- [ ] Basic endpoints are working
- [ ] Authentication flow is functional
- [ ] Database migrations work
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
