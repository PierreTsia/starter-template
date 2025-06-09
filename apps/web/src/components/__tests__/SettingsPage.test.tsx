import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock the useMe hook to simulate user data
const mockUseMe = vi.fn();
const mockUseAuth = vi.fn();
vi.mock('@/api/resources/auth/hooks', () => ({
  useMe: () => mockUseMe(),
  useAuth: () => mockUseAuth(),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    mockUseMe.mockReset();
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      },
      isLoading: false,
    });
    mockUseAuth.mockReset();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    });
  });

  const renderComponent = () => {
    return render(<TestApp initialEntries={['/settings']} />);
  };

  it('renders the settings page with user profile information', () => {
    renderComponent();

    // Check if the page title and description are rendered
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Manage your account information and preferences')).toBeInTheDocument();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('has disabled email input and no save button initially', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeDisabled();

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('shows save button only after name is changed', () => {
    renderComponent();

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
