import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

const mockUseAuth = vi.fn();
const mockUseMe = vi.fn();

// Mock the useAuth hook
vi.mock('@/api/resources/auth/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useMe: () => mockUseMe(),
}));

describe('ConfirmEmailPage', () => {
  const mockConfirmEmail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      confirmEmail: mockConfirmEmail,
      isLoading: false,
      error: null,
    });
    mockUseMe.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  const renderComponent = (token: string | null = 'valid-token') => {
    return render(<TestApp initialEntries={[`/confirm-email${token ? `?token=${token}` : ''}`]} />);
  };

  it('renders loading state', () => {
    renderComponent();

    expect(screen.getByText('Confirming your email...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('calls confirmEmail with token when mounted', async () => {
    renderComponent('test-token');

    await waitFor(() => {
      expect(mockConfirmEmail).toHaveBeenCalledWith('test-token');
    });
  });

  it('does not call confirmEmail when token is missing', async () => {
    renderComponent(null);

    await waitFor(() => {
      expect(mockConfirmEmail).not.toHaveBeenCalled();
    });
  });

  it('only calls confirmEmail once even if token changes', async () => {
    const { rerender } = renderComponent('first-token');

    await waitFor(() => {
      expect(mockConfirmEmail).toHaveBeenCalledWith('first-token');
    });

    // Clear the mock to check if it's called again
    mockConfirmEmail.mockClear();

    // Rerender with a different token
    rerender(<TestApp initialEntries={['/confirm-email?token=second-token']} />);

    await waitFor(() => {
      expect(mockConfirmEmail).not.toHaveBeenCalled();
    });
  });
});
