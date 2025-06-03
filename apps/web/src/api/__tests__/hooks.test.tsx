import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useLogin, useMe } from '../hooks';
import { mockApi } from '../mockApi';

// Mock the mockApi
vi.mock('../mockApi', () => ({
  mockApi: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      me: vi.fn(),
    },
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
      const mockToken = 'mock-jwt-token';

      vi.mocked(mockApi.auth.login).mockResolvedValueOnce({
        user: mockUser,
        token: mockToken,
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

      expect(mockApi.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
    });

    it('handles login error', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(mockApi.auth.login).mockRejectedValueOnce(error);

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
        }
      });

      expect(mockApi.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrong-password',
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
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
      vi.mocked(mockApi.auth.me).mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useMe(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.data).toEqual(mockUser);
      });

      expect(mockApi.auth.me).toHaveBeenCalledWith('mock-jwt-token');
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

      expect(mockApi.auth.me).not.toHaveBeenCalled();
    });
  });
});
