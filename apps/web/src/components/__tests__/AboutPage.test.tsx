import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AboutPage } from '../AboutPage';

import { TestApp } from '@/test-utils';

describe('AboutPage', () => {
  it('renders the about page title and description', () => {
    render(
      <TestApp initialEntries={['/about']} initialLocale="en">
        <AboutPage />
      </TestApp>
    );
    expect(screen.getByText('About This Template')).toBeInTheDocument();
    expect(
      screen.getByText(
        /A minimal but production-ready monorepo template for full-stack TypeScript applications/i
      )
    ).toBeInTheDocument();
  });

  it('renders the CTA button with GitHub link', () => {
    render(
      <TestApp initialEntries={['/about']} initialLocale="en">
        <AboutPage />
      </TestApp>
    );
    const ctaButton = screen.getByRole('link', { name: /get started/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', 'https://github.com/PierreTsia/starter-template');
    expect(ctaButton).toHaveAttribute('target', '_blank');
  });

  it('renders the tech stack section', () => {
    render(
      <TestApp initialEntries={['/about']} initialLocale="en">
        <AboutPage />
      </TestApp>
    );
    expect(screen.getByText('Built with Modern Technologies')).toBeInTheDocument();
    expect(screen.getByAltText('Vite')).toBeInTheDocument();
    expect(screen.getByAltText('React')).toBeInTheDocument();
    expect(screen.getByAltText('NestJS')).toBeInTheDocument();
    expect(screen.getByAltText('Prisma')).toBeInTheDocument();
    expect(screen.getByAltText('Tailwind')).toBeInTheDocument();
    expect(screen.getByAltText('TanStack Query')).toBeInTheDocument();
  });
});
