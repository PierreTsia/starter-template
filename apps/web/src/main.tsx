import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Root } from './Root';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './i18n/LanguageContext';

import { AppToaster } from '@/components/AppToaster';
import { ThemeProvider } from '@/components/ThemeProvider';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <AppToaster />
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Root />
            </BrowserRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
