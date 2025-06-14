import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.location
const mockLocation = {
  search: '',
  pathname: '/auth/callback',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

const renderComponent = (queryString: string = '') => {
  // Update the mock location before rendering
  mockLocation.search = queryString;
  return render(<TestApp initialEntries={[`/auth/callback${queryString}`]} />);
};

describe('AuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // Reset mock location
    mockLocation.search = '';
  });

  it('handles error in query params', async () => {
    renderComponent('?error=SomethingWentWrong');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle token and refresh token', async () => {
    renderComponent('?access_token=123&refresh_token=456');

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', '123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', '456');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
