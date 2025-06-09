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

describe('EmailConfirmationPage', () => {
  const renderComponent = (email?: string) => {
    return render(
      <TestApp initialEntries={[`/email-confirmation${email ? `?email=${email}` : ''}`]} />
    );
  };

  it('renders confirmation message and navigation button', () => {
    renderComponent('test@example.com');

    expect(screen.getByText('Check your email')).toBeInTheDocument();
    expect(screen.getByText(/We've sent a confirmation link to/)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(
      screen.getByText(/Please check your inbox and click the link to confirm your email address/)
    ).toBeInTheDocument();
    expect(screen.getByText('Back to Login')).toBeInTheDocument();
    expect(screen.getByText(/Once you've confirmed your email/)).toBeInTheDocument();
  });

  it('renders generic message when no email is provided', () => {
    renderComponent();

    expect(screen.getByText('Check your email')).toBeInTheDocument();
    expect(
      screen.getByText("We've sent you a confirmation link to verify your email address.")
    ).toBeInTheDocument();
  });

  it('navigates to login page when clicking the button', () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: 'Back to Login' });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
