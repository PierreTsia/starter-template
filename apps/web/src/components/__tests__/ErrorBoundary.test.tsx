import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { it, describe, expect, beforeAll, afterAll, vi } from 'vitest';

import { ErrorBoundary } from '../ErrorBoundary';

import { TestApp } from '@/test-utils';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  vi.restoreAllMocks();
});

const ErrorButton = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);
  if (shouldThrow) throw new Error('Boom!');
  return <button onClick={() => setShouldThrow(true)}>Trigger Error</button>;
};

describe('ErrorBoundary', () => {
  it('renders fallback UI and translation when error is thrown', () => {
    render(
      <TestApp>
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </TestApp>
    );
    fireEvent.click(screen.getByText(/trigger error/i));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
    expect(screen.getByText(/Boom!/i)).toBeInTheDocument();
  });

  it('resets error boundary when Try Again is clicked', async () => {
    render(
      <TestApp>
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </TestApp>
    );
    fireEvent.click(screen.getByText(/trigger error/i));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    // After reset, the original button should be back
    expect(screen.getByText(/trigger error/i)).toBeInTheDocument();
  });
});
