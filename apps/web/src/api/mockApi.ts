import { z } from 'zod';

import type { User, LoginInput, RegisterInput } from '@/types/auth';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2),
});

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
  },
];

// Mock API client
export const mockApi = {
  auth: {
    login: async (input: LoginInput): Promise<{ user: User; token: string }> => {
      console.log('login', input);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = MOCK_USERS.find((u) => u.email === input.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // In a real app, we'd verify the password here
      if (input.password !== 'Password123!') {
        throw new Error('Invalid credentials');
      }

      return {
        user,
        token: 'mock-jwt-token',
      };
    },

    register: async (input: RegisterInput): Promise<{ user: User; token: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (MOCK_USERS.some((u) => u.email === input.email)) {
        throw new Error('Email already exists');
      }

      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email: input.email,
        name: input.name,
        createdAt: new Date().toISOString(),
      };

      MOCK_USERS.push(newUser);

      return {
        user: newUser,
        token: 'mock-jwt-token',
      };
    },

    me: async (token: string): Promise<User> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (token !== 'mock-jwt-token') {
        throw new Error('Invalid token');
      }

      return MOCK_USERS[0];
    },
  },
};
