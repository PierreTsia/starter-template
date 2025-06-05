import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuth } from '@/api/resources/auth/hooks';
import { TestApp } from '@/test-utils';

vi.mock('@/api/resources/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

describe('AuthPage', () => {
  it('allows user to switch between login and register forms', async () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
      resetError: vi.fn(),
    });

    render(<TestApp initialEntries={['/login']} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/register/i));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('handles login form submission', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
      resetError: vi.fn(),
    });

    render(<TestApp initialEntries={['/login']} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const form = screen.getByTestId('login-form');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test123!',
      });
    });
  });

  it('handles register form submission', async () => {
    const mockRegister = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      resetError: vi.fn(),
    });

    render(<TestApp initialEntries={['/register']} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const form = screen.getByTestId('register-form');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!',
      });
    });
  });

  it('displays error message when login fails', async () => {
    const error = new Error('Invalid credentials');
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error,
      resetError: vi.fn(),
    });

    render(<TestApp initialEntries={['/login']} />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  describe('password validation', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
        error: null,
        resetError: vi.fn(),
      });
    });

    it('displays error when password is too short', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.submit(form);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('password-error');
        expect(errorMessage).toHaveTextContent(/must be at least 8 characters/i);
      });
    });

    it('displays error when password lacks uppercase letter', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'test123!' } });
      fireEvent.submit(form);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('password-error');
        expect(errorMessage).toHaveTextContent(/uppercase/i);
      });
    });

    it('displays error when password lacks number', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'TestTest!' } });
      fireEvent.submit(form);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('password-error');
        expect(errorMessage).toHaveTextContent(/number/i);
      });
    });

    it('displays error when password lacks special character', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'Test1234' } });
      fireEvent.submit(form);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('password-error');
        expect(errorMessage).toHaveTextContent(/special character/i);
      });
    });
  });

  it('displays error when passwords do not match', async () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
      resetError: vi.fn(),
    });

    render(<TestApp initialEntries={['/register']} />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const form = screen.getByTestId('register-form');

    // Fill in mismatched passwords
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!!' } });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('confirm-password-error');
      expect(errorMessage).toHaveTextContent(/passwords don't match/i);
    });
  });
});
