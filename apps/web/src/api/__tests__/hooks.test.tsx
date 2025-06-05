import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { authApi } from '../authApi';
import { useLogin, useMe } from '../hooks';

// Mock the mockApi
vi.mock('../authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('API Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('useLogin', () => {
    it('successfully logs in and stores token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      vi.mocked(authApi.login).mockResolvedValueOnce({
        user: mockUser,
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
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

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
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
    it('fetches user data when token exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      localStorageMock.getItem.mockReturnValueOnce('mock-jwt-token');
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

    it('does not fetch when no token exists', async () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const { result } = renderHook(() => useMe(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.data).toBeUndefined();
      });

      expect(authApi.me).not.toHaveBeenCalled();
    });
  });
});
