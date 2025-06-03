import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TestApp } from '@/test-utils';

describe('NotFoundPage', () => {
  it('renders the 404 title, message, and Go Home button that redirects to the home page', () => {
    render(<TestApp initialEntries={['/not-found']} />);
    expect(screen.getByText(/oups/i)).toBeInTheDocument();
    expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });
});
