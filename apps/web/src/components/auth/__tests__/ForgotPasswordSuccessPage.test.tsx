import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ForgotPasswordSuccessPage', () => {
  const renderComponent = () => {
    return render(<TestApp initialEntries={['/forgot-password/success']} />);
  };

  it('renders success message and navigation button', () => {
    renderComponent();

    expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    expect(
      screen.getByText(
        'If an account exists with this email, you will receive a password reset link. Please check your email and follow the instructions.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Back to Login')).toBeInTheDocument();
  });

  it('navigates to login page when clicking the button', () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: 'Back to Login' });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
