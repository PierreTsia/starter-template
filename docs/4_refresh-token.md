# Refresh Token Mechanism Implementation Guide

This document outlines the steps required to implement a secure refresh token mechanism in your NestJS + Prisma backend using Bearer token authentication.

---

### Front target architecture

src/api/
├── client.ts # Base fetch client
├── resources/ # Group by resource
│ ├── auth/
│ │ ├── api.ts # Raw API calls
│ │ └── hooks.ts # React Query hooks
│ ├── users/
│ │ ├── api.ts
│ │ └── hooks.ts
│ └── todos/
│ ├── api.ts
│ └── hooks.ts
└── types/ # Shared types
├── auth.ts
├── user.ts
└── post.ts

## Checklist

- [ ] Update the database schema
  - [ ] Add a `refreshToken` field to your `User` model in `prisma/schema.prisma` (or create a `RefreshToken` table for multi-device support)
  - [ ] Run `prisma migrate` to apply the changes
- [ ] Generate refresh token on login/register
  - [ ] Generate a secure, random refresh token
  - [ ] Store the refresh token in the DB (associated with the user)
  - [ ] Return both access and refresh tokens in the response body
- [ ] Create `/auth/refresh` endpoint
  - [ ] Accept the refresh token in the Authorization header
  - [ ] Validate the token (check DB, expiry, etc.)
  - [ ] If valid, issue a new access token (JWT) and optionally a new refresh token (rotation)
  - [ ] If invalid, return 401 Unauthorized
- [ ] Token rotation (optional, recommended)
  - [ ] On every refresh, generate a new refresh token and invalidate the old one (replace in DB)
- [ ] Logout and revocation
  - [ ] On logout, delete the refresh token from the DB (or mark as revoked)
  - [ ] On password change or suspicious activity, revoke all refresh tokens for the user
- [ ] Frontend responsibilities
  - [ ] Store the access token in localStorage
  - [ ] Store the refresh token in localStorage
  - [ ] When the access token expires, call `/auth/refresh` with the refresh token in Authorization header
  - [ ] On logout, clear both tokens from localStorage
- [ ] Security best practices
  - [ ] Use Bearer token authentication for both access and refresh tokens
  - [ ] Set a reasonable expiry (e.g., 7 days) for refresh tokens
  - [ ] Use strong random values for refresh tokens (or JWTs with a secret)
  - [ ] Always validate and rotate refresh tokens on use
  - [ ] Implement CSRF protection for sensitive endpoints

---

## Example Implementation Steps

1. **Schema:**
   - [ ] Add `refreshToken` to `User` or create a `RefreshToken` table
2. **AuthService:**
   - [ ] Generate and store refresh token on login/register
   - [ ] Return both tokens in response body
3. **AuthController:**
   - [ ] Add `/auth/refresh` endpoint
   - [ ] Add `/auth/logout` endpoint to clear the refresh token
4. **Guards/Middleware:**
   - [ ] Protect refresh endpoint and validate tokens
5. **Testing:**
   - [ ] Test login, refresh, and logout flows
   - [ ] Test token expiry and revocation

---

## Definition of Done

The refresh token mechanism is considered complete when:

- [ ] All required checkboxes above are checked
- [ ] Users receive both access and refresh tokens on login/register
- [ ] Refresh tokens are stored securely and validated on use
- [ ] The `/auth/refresh` endpoint issues new access tokens as expected
- [ ] Refresh tokens are rotated and revoked as needed
- [ ] Logout and password change revoke refresh tokens
- [ ] Security best practices are followed
- [ ] Tests cover all critical flows (login, refresh, logout, expiry, revocation)

---

**This doc is your checklist and reference for implementing a robust refresh token system using Bearer token authentication.**
