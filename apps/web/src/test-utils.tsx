import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { Root } from './Root';

import { ThemeProvider } from '@/components/ThemeProvider';

interface TestAppProps {
  initialEntries?: string[];
}

export const TestApp = ({ initialEntries = ['/'] }: TestAppProps) => {
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
          <Root />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
