import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuth } from '../useAuth';

import { authApi } from '@/api/resources/auth/api';

// Mock the authApi
vi.mock('@/api/resources/auth/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn().mockReturnValue({
    state: { from: { pathname: '/' } },
  }),
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('successfully logs in', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    };

    vi.mocked(authApi.login).mockResolvedValueOnce({
      user: mockUser,
      token: 'mocked-jwt-token',
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
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
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
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('successfully registers', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    };

    vi.mocked(authApi.register).mockResolvedValueOnce({
      user: mockUser,
      token: 'mocked-jwt-token',
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    });

    expect(authApi.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('handles register error', async () => {
    const error = new Error('Email already exists');
    vi.mocked(authApi.register).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      } catch (e) {
        // Expected error
        expect(e).toBe(error);
      }
    });

    expect(authApi.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('successfully logs out', async () => {
    vi.mocked(authApi.logout).mockResolvedValueOnce({ message: 'Logged out successfully' });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('handles logout error', async () => {
    const error = new Error('Logout failed');
    vi.mocked(authApi.logout).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.logout();
      } catch (e) {
        // Expected error
        expect(e).toBe(error);
      }
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
