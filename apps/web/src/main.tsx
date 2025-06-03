import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import { BuggyCounter } from './components/BuggyCounter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navbar } from './components/Navbar';
import { SettingsPage } from './components/SettingsPage';
import { TanstackDemo } from './components/TanstackDemo';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

const queryClient = new QueryClient();

const About = () => {
  return <h2>About Page</h2>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <Navbar />
            <div className="min-h-[calc(100vh-var(--navbar-height))]">
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
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
