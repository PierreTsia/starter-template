# Refresh Token Regression: 401 Unauthorized

## Summary

A regression has been observed in the refresh token logic. When making a POST request to `/api/v1/auth/refresh` with a valid refresh token (visible in the DB), the endpoint returns a 401 Unauthorized error.

## Reproduction Steps

1. Confirm a valid refresh token exists in the database for the user.
2. Make a request like:
   ```sh
   curl 'http://localhost:3000/api/v1/auth/refresh' \
     -X 'POST' \
     -H 'Authorization: Bearer <refresh_token>' \
     ...
   ```
3. Observe a 401 response, even though the token is present in the DB.

## Expected

The refresh endpoint should accept the valid token and issue a new access token.

## Actual

The endpoint returns 401 Unauthorized.

## Notes

- The DB row for the refresh token exists and matches the token used in the request.
- This is a regression; the logic previously worked.

## Next Steps

- Investigate the refresh token validation logic in the backend.
- Check for recent changes to the auth middleware, token parsing, or DB query logic.
- Ensure the token is not expired and is being compared correctly (case, encoding, etc).

## Status

Documented for future debugging. No fix attempted yet.
