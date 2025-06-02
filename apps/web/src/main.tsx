import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TanstackDemo } from './components/TanstackDemo';
import './index.css';

const queryClient = new QueryClient();

const About = () => {
  return <h2>About Page</h2>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <nav style={{ marginBottom: 16 }}>
            <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
            <Link to="/buggy">Buggy Counter</Link> | <Link to="/tanstack-demo">TanStack Demo</Link>
          </nav>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/tanstack-demo"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TanstackDemo />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
