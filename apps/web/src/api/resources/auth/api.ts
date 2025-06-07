import { apiFetch } from '@/api/client';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

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
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
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
};
