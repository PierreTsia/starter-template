import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuth } from '../useAuth';

import { mockApi } from '@/api/mockApi';

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

// Mock the mockApi
vi.mock('@/api/mockApi', () => ({
  mockApi: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
    },
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create a wrapper component that provides the router context
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  const mockNavigate = vi.fn();
  const mockLocation = { state: { from: { pathname: '/dashboard' } } };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue(mockLocation as any);
  });

  describe('login', () => {
    it('successfully logs in and navigates to the intended destination', async () => {
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

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(() =>
        Promise.resolve(
          result.current.login({
            email: 'test@example.com',
            password: 'Password123!',
          })
        )
      );

      expect(mockApi.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('handles login error', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(mockApi.auth.login).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(() =>
        Promise.resolve(
          result.current.login({
            email: 'test@example.com',
            password: 'wrong-password',
          })
        )
      );

      await waitFor(() => {
        expect(result.current.error).toBe(error);
      });

      expect(mockApi.auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrong-password',
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('successfully registers and navigates to the intended destination', async () => {
      const mockUser = {
        id: '2',
        email: 'new@example.com',
        name: 'New User',
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token';

      vi.mocked(mockApi.auth.register).mockResolvedValueOnce({
        user: mockUser,
        token: mockToken,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(() =>
        Promise.resolve(
          result.current.register({
            name: 'New User',
            email: 'new@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!',
          })
        )
      );

      expect(mockApi.auth.register).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('handles registration error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(mockApi.auth.register).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(() =>
        Promise.resolve(
          result.current.register({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!',
          })
        )
      );

      await waitFor(() => {
        expect(result.current.error).toBe(error);
      });

      expect(mockApi.auth.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('clears token and navigates to login page', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(() => Promise.resolve(result.current.logout()));

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });
});
