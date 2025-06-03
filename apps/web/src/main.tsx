import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { BuggyCounter } from './components/BuggyCounter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SettingsPage } from './components/SettingsPage';
import { TanstackDemo } from './components/TanstackDemo';

import App from '@/App';
import { AppToaster } from '@/components/AppToaster';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import './index.css';

const queryClient = new QueryClient();

const AboutPage = () => {
  return <h2>About Page</h2>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppToaster />
          <BrowserRouter>
            <Navbar />
            <div className="container min-h-[calc(100vh-var(--navbar-height))] mx-auto px-4">
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/buggy" element={<BuggyCounter />} />
                <Route
                  path="/tanstack-demo"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <TanstackDemo />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
