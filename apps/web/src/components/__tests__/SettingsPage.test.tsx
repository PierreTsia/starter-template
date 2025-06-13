import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock the useAuth hook
const mockUpdatePassword = vi.fn();

vi.mock('@/api/resources/auth/hooks', () => ({
  useAuth: () => ({
    updatePassword: mockUpdatePassword,
  }),
  useMe: () => ({
    data: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    isLoading: false,
  }),
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

const renderComponent = () => {
  return render(<TestApp initialEntries={['/settings']} />);
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settings page', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Manage your account information and preferences')).toBeInTheDocument();
  });

  it('updates password successfully', async () => {
    renderComponent();

    const passwordInput = screen.getByTestId('current-password-input');
    expect(passwordInput).toBeInTheDocument();

    const newPasswordInput = screen.getByTestId('new-password-input');
    expect(newPasswordInput).toBeInTheDocument();

    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    expect(confirmPasswordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'NewPassword!' } });
    expect(passwordInput).toHaveValue('NewPassword!');

    fireEvent.change(newPasswordInput, { target: { value: 'NewPassword2!' } });
    expect(newPasswordInput).toHaveValue('NewPassword2!');

    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword2!' } });
    expect(confirmPasswordInput).toHaveValue('NewPassword2!');

    const updateButton = screen.getByRole('button', { name: /update password/i });
    expect(updateButton).toBeInTheDocument();

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        currentPassword: 'NewPassword!',
        newPassword: 'NewPassword2!',
      });
    });
  });
});
