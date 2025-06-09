import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { Root } from './Root';
import { LanguageProvider } from './i18n/LanguageContext';
import enMessages from './i18n/locales/en.json';
import { flattenMessages } from './i18n/utils';

import { ThemeProvider } from '@/components/ThemeProvider';

interface TestAppProps {
  children?: ReactNode;
  initialEntries?: string[];
}

export const TestApp = ({ children, initialEntries = ['/'] }: TestAppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter
          initialEntries={initialEntries}
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          <LanguageProvider>
            <IntlProvider messages={flattenMessages(enMessages)} locale="en" defaultLocale="en">
              {children || <Root />}
            </IntlProvider>
          </LanguageProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (ui: ReactNode, options?: { initialEntries?: string[] }) => {
  return render(<TestApp initialEntries={options?.initialEntries}>{ui}</TestApp>);
};
