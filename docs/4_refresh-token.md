# Refresh Token Mechanism Implementation Guide

This document outlines the steps required to implement a secure refresh token mechanism in your NestJS + Prisma backend using Bearer token authentication.

---

## Checklist

- [x] Update the database schema
  - [x] Add a `refreshToken` field to your `User` model in `prisma/schema.prisma` (or create a `RefreshToken` table for multi-device support)
  - [x] Run `prisma migrate` to apply the changes
- [x] Generate refresh token on login/register
  - [x] Generate a secure, random refresh token
  - [x] Store the refresh token in the DB (associated with the user)
  - [x] Return both access and refresh tokens in the response body
- [x] Create `/auth/refresh` endpoint
  - [x] Accept the refresh token in the Authorization header
  - [x] Validate the token (check DB, expiry, etc.)
  - [x] If valid, issue a new access token (JWT) and optionally a new refresh token (rotation)
  - [x] If invalid, return 401 Unauthorized
- [x] Token rotation (optional, recommended)
  - [x] On every refresh, generate a new refresh token and invalidate the old one (replace in DB)
- [x] Logout and revocation
  - [x] On logout, delete the refresh token from the DB (or mark as revoked)
  - [x] On password change or suspicious activity, revoke all refresh tokens for the user
- [ ] Frontend responsibilities
  - [ ] Store the access token in localStorage
  - [ ] Store the refresh token in localStorage
  - [ ] When the access token expires, call `/auth/refresh` with the refresh token in Authorization header
  - [ ] On logout, clear both tokens from localStorage
- [x] Security best practices
  - [x] Use Bearer token authentication for both access and refresh tokens
  - [x] Set a reasonable expiry (e.g., 7 days) for refresh tokens
  - [x] Use strong random values for refresh tokens (or JWTs with a secret)
  - [x] Always validate and rotate refresh tokens on use
  - [x] Implement CSRF protection for sensitive endpoints

---

## Example Implementation Steps

1. **Schema:**
   - [x] Add `refreshToken` to `User` or create a `RefreshToken` table
2. **AuthService:**
   - [x] Generate and store refresh token on login/register
   - [x] Return both tokens in response body
3. **AuthController:**
   - [x] Add `/auth/refresh` endpoint
   - [x] Add `/auth/logout` endpoint to clear the refresh token
4. **Guards/Middleware:**
   - [x] Protect refresh endpoint and validate tokens
5. **Testing:**
   - [ ] Test login, refresh, and logout flows
   - [ ] Test token expiry and revocation

---

## Definition of Done

The refresh token mechanism is considered complete when:

- [x] All required checkboxes above are checked
- [x] Users receive both access and refresh tokens on login/register
- [x] Refresh tokens are stored securely and validated on use
- [x] The `/auth/refresh` endpoint issues new access tokens as expected
- [x] Refresh tokens are rotated and revoked as needed
- [x] Logout and password change revoke refresh tokens
- [x] Security best practices are followed
- [ ] Tests cover all critical flows (login, refresh, logout, expiry, revocation)

---

**This doc is your checklist and reference for implementing a robust refresh token system using Bearer token authentication.**
