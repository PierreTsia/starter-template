import { describe, expect, it, beforeEach, vi } from 'vitest';

import { apiFetch } from './client';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    // Default locale to 'en'
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'locale') return 'en';
      return null;
    });
  });

  it('should make a basic request without auth token', async () => {
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiFetch('/test');

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/test', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should include auth token and language in headers when available', async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      if (key === 'locale') return 'fr';
      return null;
    });

    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiFetch('/test');

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/test', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fr',
        Authorization: 'Bearer test-token',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should not include auth token for logout endpoint', async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      if (key === 'locale') return 'fr';
      return null;
    });

    const mockResponse = { message: 'Logged out' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiFetch('/auth/logout');

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/auth/logout', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fr',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle 401 by refreshing token and retrying', async () => {
    // Setup tokens
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'old-token';
      if (key === 'refreshToken') return 'refresh-token';
      if (key === 'locale') return 'fr';
      return null;
    });

    // First request fails with 401
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    // Refresh token request succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          accessToken: 'new-token',
          refreshToken: 'new-refresh-token',
        }),
    });

    // Retry request succeeds
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiFetch('/test');

    // Verify refresh token was called
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer refresh-token',
        'Accept-Language': 'fr',
      },
    });

    // Verify tokens were updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');

    // Verify retry was made with new token
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/test', {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fr',
        Authorization: 'Bearer new-token',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should clear tokens and throw error on refresh failure', async () => {
    // Setup tokens
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'old-token';
      if (key === 'refreshToken') return 'refresh-token';
      if (key === 'locale') return 'fr';
      return null;
    });

    // First request fails with 401
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    // Refresh token request fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(apiFetch('/test')).rejects.toThrow('Failed to refresh token');

    // Verify tokens were cleared
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  it('should handle error responses with error messages', async () => {
    const errorResponse = {
      errors: ['Error 1', 'Error 2'],
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(errorResponse),
    });

    await expect(apiFetch('/test')).rejects.toThrow('Error 1\nError 2');
  });

  it('should handle error responses with single message', async () => {
    const errorResponse = {
      message: 'Single error message',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(errorResponse),
    });

    await expect(apiFetch('/test')).rejects.toThrow('Single error message');
  });

  it('should handle malformed error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(apiFetch('/test')).rejects.toThrow('Unknown error');
  });
});
