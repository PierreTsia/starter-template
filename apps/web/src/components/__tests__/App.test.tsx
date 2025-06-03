import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock the useMe hook to simulate different auth states
vi.mock('@/api/hooks', () => ({
  useMe: () => ({ data: null, isLoading: false }),
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
  it('renders the App page when user is authenticated', () => {
    localStorage.setItem('token', 'mock-jwt-token');
    render(<TestApp initialEntries={['/']} />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('redirects to login page when user is not authenticated', () => {
    // Clear localStorage to simulate no token
    localStorage.clear();

    render(<TestApp initialEntries={['/']} />);
    // Assert that the login form is rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
