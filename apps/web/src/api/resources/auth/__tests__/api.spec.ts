import { describe, expect, it, beforeEach, vi } from 'vitest';

import { authApi } from '../api';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  apiFetch: vi.fn(),
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock the apiFetch function
vi.mock('@/api/client', () => ({
  apiFetch: mocks.apiFetch,
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', { value: mocks.localStorage });

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const input = { email: 'test@example.com', password: 'password' };
      const result = await authApi.login(input);

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const input = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const result = await authApi.register(input);

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call apiFetch with refresh token from localStorage', async () => {
      const mockResponse = { message: 'Logged out successfully' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);
      mocks.localStorage.getItem.mockReturnValueOnce('refresh-token');

      const result = await authApi.logout();

      expect(mocks.localStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer refresh-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should reject if no refresh token is found', async () => {
      mocks.localStorage.getItem.mockReturnValueOnce(null);

      await expect(authApi.logout()).rejects.toThrow('No refresh token found');
      expect(mocks.apiFetch).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call apiFetch with provided refresh token', async () => {
      const mockResponse = { accessToken: 'new-token', refreshToken: 'new-refresh' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.refresh('refresh-token');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer refresh-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('me', () => {
    it('should call apiFetch with correct endpoint', async () => {
      const mockResponse = { id: '1', email: 'test@example.com', name: 'Test User' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.me();

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/whoami');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Reset email sent' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.forgotPassword('test@example.com');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Password reset successful' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.resetPassword('valid-token', 'new-password');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: 'valid-token', password: 'new-password' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmEmail', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Email confirmed' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.confirmEmail('valid-token');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/confirm-email?token=valid-token', {
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resendConfirmation', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Confirmation email resent' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.resendConfirmation('test@example.com');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/resend-confirmation', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should refresh token and update localStorage', async () => {
      const mockResponse = { accessToken: 'new-access', refreshToken: 'new-refresh' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);
      mocks.localStorage.getItem.mockReturnValueOnce('old-refresh');

      const result = await authApi.refreshToken();

      expect(mocks.localStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer old-refresh',
        },
      });
      expect(mocks.localStorage.setItem).toHaveBeenCalledWith('token', 'new-access');
      expect(mocks.localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh');
      expect(result).toBe('new-access');
    });

    it('should throw error if no refresh token found', async () => {
      mocks.localStorage.getItem.mockReturnValueOnce(null);

      await expect(authApi.refreshToken()).rejects.toThrow('No refresh token found');
      expect(mocks.apiFetch).not.toHaveBeenCalled();
    });

    it('should clear tokens and throw error on refresh failure', async () => {
      mocks.localStorage.getItem.mockReturnValueOnce('old-refresh');
      mocks.apiFetch.mockRejectedValueOnce(new Error('Refresh failed'));

      await expect(authApi.refreshToken()).rejects.toThrow('Refresh failed');
      expect(mocks.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mocks.localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('updatePassword', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Password updated' };
      mocks.apiFetch.mockResolvedValueOnce(mockResponse);

      const result = await authApi.updatePassword('OldPassword!', 'NewPassword!');

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: 'OldPassword!', newPassword: 'NewPassword!' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
