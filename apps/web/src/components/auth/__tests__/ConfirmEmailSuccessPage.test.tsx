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

describe('ConfirmEmailSuccessPage', () => {
  const renderComponent = () => {
    return render(<TestApp initialEntries={['/confirm-email/success']} />);
  };

  it('renders success message and navigation button', () => {
    renderComponent();

    expect(screen.getByText('Email Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('Your email has been successfully confirmed')).toBeInTheDocument();
    expect(screen.getByText('Go to Login')).toBeInTheDocument();
    expect(screen.getByText('You can now log in to your account')).toBeInTheDocument();
  });

  it('navigates to login page when clicking the button', () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: 'Go to Login' });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
