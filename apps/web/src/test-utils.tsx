import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { Root } from './Root';
import { LanguageProvider } from './i18n/LanguageContext';
import enMessages from './i18n/locales/en.json';
import frMessages from './i18n/locales/fr.json';
import { flattenMessages } from './i18n/utils';

import { ThemeProvider } from '@/components/ThemeProvider';

interface TestAppProps {
  children?: ReactNode;
  initialEntries?: string[];
  initialLocale?: 'en' | 'fr';
}

const messages = {
  en: flattenMessages(enMessages),
  fr: flattenMessages(frMessages),
};

export const TestApp = ({
  children,
  initialEntries = ['/'],
  initialLocale = 'en',
}: TestAppProps) => {
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
            <IntlProvider
              messages={messages[initialLocale]}
              locale={initialLocale}
              defaultLocale="en"
            >
              {children || <Root />}
            </IntlProvider>
          </LanguageProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: ReactNode,
  options?: { initialEntries?: string[]; initialLocale?: 'en' | 'fr' }
) => {
  return render(
    <TestApp initialEntries={options?.initialEntries} initialLocale={options?.initialLocale}>
      {ui}
    </TestApp>
  );
};
