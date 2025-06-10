import { apiFetch } from '@/api/client';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authApi = {
  login: (input: LoginInput) =>
    apiFetch<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  register: (input: RegisterInput) =>
    apiFetch<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  confirmEmail: (token: string) =>
    apiFetch<{ message: string }>(`/api/v1/auth/confirm-email?token=${token}`, {
      method: 'GET',
    }),
  resendConfirmation: (email: string) =>
    apiFetch<{ message: string }>('/api/v1/auth/resend-confirmation', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    apiFetch<{ message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  logout: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token found'));
    }
    return apiFetch<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },
  refresh: (refreshToken: string) =>
    apiFetch<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }),
  me: () => apiFetch<User>('/api/v1/users/whoami'),
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await authApi.refresh(refreshToken);
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      return accessToken;
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      throw error;
    }
  },
};
