# Wiring Frontend to Backend

This guide explains how to connect your frontend (FE) to your backend (BE) API, handle authentication tokens, and deploy without CORS issues.

---

## Checklist

- [x] Configure API base URL for different environments (local, production)
- [x] Connect login/register forms to backend endpoints
- [ ] Store authentication token after login/register
  - [x] Start with localStorage/sessionStorage
  - [ ] Upgrade to httpOnly cookies for security
- [x] Handle token in API requests (Authorization header)
- [ ] Deploy FE and BE to cloud platforms
- [x] Ensure CORS is correctly configured on the backend
- [ ] Test authentication flow end-to-end in production

---

## 1. Configure API Base URL

- Use environment variables (e.g., `VITE_API_URL`) in your frontend to switch between local and production API URLs.
- Example in Vite:
  ```js
  const apiUrl = import.meta.env.VITE_API_URL;
  ```
- Set this variable in your `.env` files and in your deployment platform (e.g., Vercel).

---

## 2. Connect Forms to Backend Endpoints

- Update your login/register forms to POST to:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
- Use `fetch` or your HTTP client (e.g., Axios):
  ```js
  fetch(`${apiUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  ```

---

## 3. Store the Token

- **Initial approach:** Store the JWT in `localStorage` or `sessionStorage` after login/register.
  ```js
  localStorage.setItem('token', response.token);
  ```
- **Best practice:** Use httpOnly cookies for security (prevents XSS attacks). This requires backend support for setting cookies.
- To upgrade:
  - Update backend to set `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict` on login/register
  - On frontend, use `credentials: 'include'` in fetch requests

---

## 4. Use the Token in API Requests

- For endpoints that require authentication, send the token in the `Authorization` header:
  ```js
  fetch(`${apiUrl}/api/v1/users/whoami`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```
- If using httpOnly cookies, the browser will send the cookie automatically (with `credentials: 'include'`).

---

## 5. Deploy and Test

- Deploy the frontend (e.g., to Vercel) and backend (e.g., to Render)
- Set the correct `VITE_API_URL` in your frontend deployment environment
- Test login/register and authenticated requests in production

---

## 6. CORS Configuration

- On the backend, configure CORS to allow requests from your frontend domain:
  ```ts
  app.enableCors({
    origin: [
      'http://localhost:5173', // local dev
      'https://your-frontend.vercel.app', // production FE
    ],
    credentials: true, // if using cookies
  });
  ```
- Ensure `credentials: true` is set if you use cookies for auth
- Only allow trusted origins in production

---

## 7. Troubleshooting

- **CORS errors:**
  - Check allowed origins in backend CORS config
  - Ensure frontend uses the correct API URL
  - If using cookies, set `credentials: 'include'` in fetch/Axios
- **Token not stored:**
  - Check response from backend includes the token
  - For cookies, check `Set-Cookie` header and browser cookie storage
- **Auth errors:**
  - Ensure token is sent in `Authorization` header or as a cookie
  - Check backend logs for error details

---

## Definition of Done

- [x] FE can register and log in users via BE endpoints
- [x] Token is stored and used for authenticated requests
- [ ] No CORS errors in production
- [ ] Auth flow works end-to-end in deployed environments

---

**This doc is your reference for wiring up your frontend to your backend API securely and reliably.**
