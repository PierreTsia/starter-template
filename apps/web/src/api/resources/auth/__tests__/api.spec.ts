import { describe, expect, it, beforeEach, vi } from 'vitest';

import { authApi } from '../api';

import { apiFetch } from '@/api/client';

// Mock the apiFetch function
vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const input = { email: 'test@example.com', password: 'password' };
      const result = await authApi.login(input);

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const input = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const result = await authApi.register(input);

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call apiFetch with refresh token from localStorage', async () => {
      const mockResponse = { message: 'Logged out successfully' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
      mockLocalStorage.getItem.mockReturnValueOnce('refresh-token');

      const result = await authApi.logout();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer refresh-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should reject if no refresh token is found', async () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null);

      await expect(authApi.logout()).rejects.toThrow('No refresh token found');
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call apiFetch with provided refresh token', async () => {
      const mockResponse = { accessToken: 'new-token', refreshToken: 'new-refresh' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await authApi.refresh('refresh-token');

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/refresh', {
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
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await authApi.me();

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/users/whoami');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Reset email sent' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await authApi.forgotPassword('test@example.com');

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Password reset successful' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await authApi.resetPassword('valid-token', 'new-password');

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: 'valid-token', password: 'new-password' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmEmail', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockResponse = { message: 'Email confirmed' };
      (apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await authApi.confirmEmail('valid-token');

      expect(apiFetch).toHaveBeenCalledWith('/api/v1/auth/confirm-email?token=valid-token', {
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
