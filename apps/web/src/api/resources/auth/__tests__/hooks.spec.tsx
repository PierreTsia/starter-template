import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { authApi } from '../api';
import { useAuth, useMe } from '../hooks';

// Mock the authApi
vi.mock('../api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

// Create a wrapper component for the hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe('Auth Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAuth', () => {
    it('successfully logs in', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      vi.mocked(authApi.login).mockResolvedValueOnce({
        user: mockUser,
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('handles login error', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(authApi.login).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrong-password',
          });
        } catch (e) {
          // Expected error
          expect(e).toBe(error);
        }
      });

      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrong-password',
      });
    });
  });

  describe('useMe', () => {
    it('fetches user data', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      vi.mocked(authApi.me).mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useMe(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.data).toEqual(mockUser);
      });

      expect(authApi.me).toHaveBeenCalled();
    });

    it('handles fetch error', async () => {
      const error = new Error('Not authenticated');
      vi.mocked(authApi.me).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMe(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.error).toBe(error);
      });

      expect(authApi.me).toHaveBeenCalled();
    });
  });
});
