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

describe('ForgotPasswordPage', () => {
  const mockForgotPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      forgotPassword: mockForgotPassword,
      isLoading: false,
      error: null,
    });
  });

  const renderComponent = () => {
    return render(<TestApp initialEntries={['/forgot-password']} />);
  };

  it('renders the forgot password form', () => {
    renderComponent();

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByText(/Enter your email address/)).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Link' });

    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Wait for the form validation to complete

    await waitFor(() => {
      const errorMessage = screen.getByText('Please enter a valid email address');
      expect(errorMessage).toBeInTheDocument();
    });

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('handles loading state', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      forgotPassword: mockForgotPassword,
      isLoading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  });

  it('displays error message when API call fails', () => {
    const errorMessage = 'Failed to send reset link';
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      forgotPassword: mockForgotPassword,
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
});
