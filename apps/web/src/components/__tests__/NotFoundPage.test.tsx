import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the 404 title, message, and Go Home button that redirects to the home page', () => {
    render(
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/oups/i)).toBeInTheDocument();
    expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });
});
