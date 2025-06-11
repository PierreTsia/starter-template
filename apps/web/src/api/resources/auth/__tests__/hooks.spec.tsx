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
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    confirmEmail: vi.fn(),
    resendConfirmation: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

    it('successfully registers a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      vi.mocked(authApi.register).mockResolvedValueOnce({
        user: mockUser,
        accessToken: 'mocked-jwt-token',
        refreshToken: 'mocked-refresh-token',
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
      expect(mockNavigate).toHaveBeenCalledWith('/email-confirmation?email=test%40example.com', {
        replace: true,
      });
    });

    it('handles registration error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(authApi.register).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.register({
            email: 'existing@example.com',
            password: 'password123',
            name: 'Test User',
          });
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(authApi.register).toHaveBeenCalledWith({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('successfully requests password reset', async () => {
      vi.mocked(authApi.forgotPassword).mockResolvedValueOnce({ message: 'Reset email sent' });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.forgotPassword('test@example.com');
      });

      expect(authApi.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password/success', { replace: true });
    });

    it('handles password reset request error', async () => {
      const error = new Error('User not found');
      vi.mocked(authApi.forgotPassword).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.forgotPassword('nonexistent@example.com');
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(authApi.forgotPassword).toHaveBeenCalledWith('nonexistent@example.com');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('successfully resets password', async () => {
      vi.mocked(authApi.resetPassword).mockResolvedValueOnce({
        message: 'Password reset successful',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.resetPassword({
          token: 'valid-token',
          password: 'new-password',
        });
      });

      expect(authApi.resetPassword).toHaveBeenCalledWith('valid-token', 'new-password');
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('handles password reset error', async () => {
      const error = new Error('Invalid token');
      vi.mocked(authApi.resetPassword).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.resetPassword({
            token: 'invalid-token',
            password: 'new-password',
          });
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(authApi.resetPassword).toHaveBeenCalledWith('invalid-token', 'new-password');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('successfully confirms email', async () => {
      vi.mocked(authApi.confirmEmail).mockResolvedValueOnce({ message: 'Email confirmed' });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.confirmEmail('valid-token');
      });

      expect(authApi.confirmEmail).toHaveBeenCalledWith('valid-token');
      expect(mockNavigate).toHaveBeenCalledWith('/confirm-email/success', { replace: true });
    });

    it('handles email confirmation error', async () => {
      const error = new Error('Invalid token');
      vi.mocked(authApi.confirmEmail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.confirmEmail('invalid-token');
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(authApi.confirmEmail).toHaveBeenCalledWith('invalid-token');
      expect(mockNavigate).toHaveBeenCalledWith('/confirm-email/error', {
        replace: true,
        state: { error },
      });
    });

    it('successfully resends confirmation email', async () => {
      vi.mocked(authApi.resendConfirmation).mockResolvedValueOnce({
        message: 'Confirmation email resent',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.resendConfirmation('test@example.com');
      });

      expect(authApi.resendConfirmation).toHaveBeenCalledWith('test@example.com');
      expect(mockNavigate).toHaveBeenCalledWith(
        '/email-confirmation?email=test%40example.com&resend=true',
        {
          replace: true,
        }
      );
    });

    it('handles resend confirmation error', async () => {
      const error = new Error('Email not found');
      vi.mocked(authApi.resendConfirmation).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.resendConfirmation('nonexistent@example.com');
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(authApi.resendConfirmation).toHaveBeenCalledWith('nonexistent@example.com');
      expect(mockNavigate).not.toHaveBeenCalled();
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

  describe('logout', () => {
    it('successfully logs out and cleans up', async () => {
      vi.mocked(authApi.logout).mockResolvedValueOnce({ message: 'Logged out successfully' });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(authApi.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
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
          expect(e).toBe(error);
        }
      });

      expect(authApi.logout).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});
