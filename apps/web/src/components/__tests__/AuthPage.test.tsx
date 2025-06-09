import './__mocks__/auth';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockUseMe, mockUseAuth } from './__mocks__/auth';

import { TestApp } from '@/test-utils';

describe('AuthPage', () => {
  beforeEach(() => {
    mockUseMe.mockReset();
    mockUseMe.mockReturnValue({
      promise: Promise.resolve({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      }),
    });
    mockUseAuth.mockReset();
  });

  it('allows user to switch between login and register forms', async () => {
    mockUseAuth.mockReturnValue({
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

    fireEvent.click(screen.getByText('Create an account'));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('handles login form submission', async () => {
    const mockLogin = vi.fn();
    mockUseAuth.mockReturnValue({
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
    mockUseAuth.mockReturnValue({
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
    mockUseAuth.mockReturnValue({
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
      mockUseAuth.mockReturnValue({
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
        expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('displays error when password lacks uppercase letter', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'test123!' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
      });
    });

    it('displays error when password lacks number', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'TestTest!' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/number/i)).toBeInTheDocument();
      });
    });

    it('displays error when password lacks special character', async () => {
      render(<TestApp initialEntries={['/register']} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const form = screen.getByTestId('register-form');

      fireEvent.change(passwordInput, { target: { value: 'Test1234' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/special character/i)).toBeInTheDocument();
      });
    });
  });

  it('displays error when passwords do not match', async () => {
    mockUseAuth.mockReturnValue({
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
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  describe('Language Switching', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
        error: null,
        resetError: vi.fn(),
      });
    });

    it('displays English content by default', () => {
      render(<TestApp initialEntries={['/login']} initialLocale="en" />);

      // Check form labels
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

      // Check button texts
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    });

    it('displays French content when French locale is set', () => {
      render(<TestApp initialEntries={['/login']} initialLocale="fr" />);

      // Check form labels in French
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();

      // Check button texts in French
      expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
      expect(screen.getByText(/créer un compte/i)).toBeInTheDocument();
    });

    it('displays validation messages in French', async () => {
      render(<TestApp initialEntries={['/login']} initialLocale="fr" />);

      // Submit empty form to trigger validation
      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);

      // Check validation messages in French
      await waitFor(() => {
        expect(screen.getByText(/veuillez entrer une adresse email valide/i)).toBeInTheDocument();
        expect(
          screen.getByText(/le mot de passe doit contenir au moins 8 caractères/i)
        ).toBeInTheDocument();
      });
    });
  });
});
