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

describe('ConfirmEmailErrorPage', () => {
  const renderComponent = () => {
    return render(<TestApp initialEntries={['/confirm-email/error']} />);
  };

  it('renders error message and navigation button', () => {
    renderComponent();

    expect(screen.getByText('Confirmation Failed')).toBeInTheDocument();
    expect(screen.getByText('We were unable to confirm your email')).toBeInTheDocument();
    expect(
      screen.getByText('The confirmation link may have expired or is invalid')
    ).toBeInTheDocument();
    expect(screen.getByText('Try Registering Again')).toBeInTheDocument();
    expect(screen.getByText('You can create a new account with your email')).toBeInTheDocument();
  });

  it('navigates to register page when clicking the button', () => {
    renderComponent();

    const registerButton = screen.getByRole('button', { name: 'Try Registering Again' });
    fireEvent.click(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
