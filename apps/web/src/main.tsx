import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import { BuggyCounter } from './components/BuggyCounter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navbar } from './components/Navbar';
import { TanstackDemo } from './components/TanstackDemo';
import './index.css';

const queryClient = new QueryClient();

const About = () => {
  return <h2>About Page</h2>;
};

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto py-12 px-4">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p className="text-muted-foreground mb-4">Dark mode toggle coming soon.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
