import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuth } from '@/api/resources/auth/hooks';
import { TestApp } from '@/test-utils';

// Mock the useAuth hook
vi.mock('@/api/resources/auth/hooks', () => ({
  useAuth: vi.fn(),
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

describe('ResetPasswordPage', () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      resetPassword: mockResetPassword,
      isLoading: false,
      error: null,
    });
  });

  const renderComponent = (token: string | null = 'valid-token') => {
    return render(
      <TestApp initialEntries={[`/reset-password${token ? `?token=${token}` : ''}`]} />
    );
  };

  it('renders the reset password form when token is valid', () => {
    renderComponent();

    expect(screen.getByText('Enter your new password below')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument();
  });

  it('shows invalid link message when token is missing', () => {
    renderComponent(null);

    expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
    expect(
      screen.getByText(/This password reset link is invalid or has expired/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request New Reset Link' })).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    // Test password too short
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    // Test missing uppercase
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must contain at least one uppercase letter')
      ).toBeInTheDocument();
    });

    // Test missing lowercase
    fireEvent.change(passwordInput, { target: { value: 'PASSWORD123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'PASSWORD123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must contain at least one lowercase letter')
      ).toBeInTheDocument();
    });

    // Test missing number
    fireEvent.change(passwordInput, { target: { value: 'Password!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
    });

    // Test missing special character
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must contain at least one special character')
      ).toBeInTheDocument();
    });
  });

  it('validates password matching', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('handles form submission with valid password', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: 'valid-token',
        password: 'Password123!',
      });
    });
  });

  it('handles loading state', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      resetPassword: mockResetPassword,
      isLoading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByRole('button', { name: 'Resetting...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resetting...' })).toBeDisabled();
  });

  it('displays error message when API call fails', () => {
    const errorMessage = 'Failed to reset password';
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      resetPassword: mockResetPassword,
      isLoading: false,
      error: new Error(errorMessage),
    });

    renderComponent();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('navigates to login page when clicking back button', () => {
    renderComponent();

    const backButton = screen.getByRole('button', { name: 'Back to Login' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to forgot password page when clicking request new link', () => {
    renderComponent(null);

    const requestNewLinkButton = screen.getByRole('button', { name: 'Request New Reset Link' });
    fireEvent.click(requestNewLinkButton);

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});
