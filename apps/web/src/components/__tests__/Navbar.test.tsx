import { render, screen, waitFor } from '@testing-library/react';
import * as userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Navbar } from '../Navbar';

import { TestApp } from '@/test-utils';

const mockUseMe = vi.fn();
const mockUseAuth = vi.fn();
const mockHandleLogout = vi.fn();
const mockRefetch = vi.fn();

vi.mock('@/api/resources/auth/hooks', () => ({
  useMe: () => mockUseMe(),
  useAuth: () => mockUseAuth(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    mockUseMe.mockReset();
    mockUseMe.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: mockRefetch,
    });
    mockUseAuth.mockReset();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });
    mockHandleLogout.mockReset();
    mockRefetch.mockReset();
  });

  it('renders the logo and language switcher when not authenticated', () => {
    render(
      <TestApp>
        <Navbar />
      </TestApp>
    );

    expect(screen.getByText('StarterKit')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.queryByText('Features')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument();
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByText('Tasks')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('renders all elements when authenticated and handles logout', async () => {
    const user = userEvent.default.setup();

    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      },
      isLoading: false,
      refetch: mockRefetch,
    });
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockHandleLogout,
    });

    render(
      <TestApp>
        <Navbar />
      </TestApp>
    );

    expect(screen.getByText('StarterKit')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    const avatarButton = screen.getByTestId('user-avatar');
    await user.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
