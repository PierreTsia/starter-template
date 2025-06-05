import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock the useMe hook to simulate different auth states
const mockUseMe = vi.fn();
vi.mock('@/api/hooks', () => ({
  useMe: () => mockUseMe(),
}));

// Mock the useAuth hook to simulate login/logout
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    error: null,
    resetError: vi.fn(),
  }),
}));

describe('App Integration', () => {
  beforeEach(() => {
    mockUseMe.mockReset();
  });

  it('renders the App page when user is authenticated', () => {
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      },
      isLoading: false,
    });

    render(<TestApp initialEntries={['/']} />);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it('redirects to login page when user is not authenticated', () => {
    mockUseMe.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<TestApp initialEntries={['/']} />);
    // Assert that the login form is rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
