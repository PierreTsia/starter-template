import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import App from './App';
import { AboutPage } from './components/AboutPage';
import { BuggyCounter } from './components/BuggyCounter';
import { LoadingSpinner } from './components/LoadingSpinner';
import { NotFoundPage } from './components/NotFoundPage';
import { SettingsPage } from './components/SettingsPage';
import { TanstackDemo } from './components/TanstackDemo';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const Root = () => {
  return (
    <div className="container min-h-[calc(100vh-var(--navbar-height))] mx-auto px-4">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buggy"
          element={
            <ProtectedRoute>
              <BuggyCounter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tanstack-demo"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <TanstackDemo />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};
