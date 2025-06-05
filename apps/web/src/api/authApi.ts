import { apiFetch } from './client';

import type { LoginInput, RegisterInput, User } from '@/types/auth';

export const authApi = {
  login: (input: LoginInput) =>
    apiFetch<{ user: User; token: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  register: (input: RegisterInput) =>
    apiFetch<{ user: User; token: string }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  me: () => apiFetch<User>('/api/v1/users/whoami'),
};
