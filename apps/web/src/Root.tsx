import { Route, Routes } from 'react-router-dom';

import App from './App';
import { AboutPage } from './components/AboutPage';
import { NotFoundPage } from './components/NotFoundPage';
import { SettingsPage } from './components/SettingsPage';
import { AuthPage } from './components/auth/AuthPage';
import { ConfirmEmailPage } from './components/auth/ConfirmEmailPage';
import { EmailConfirmationPage } from './components/auth/EmailConfirmationPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Navbar } from '@/components/Navbar';
import { ConfirmEmailErrorPage } from '@/components/auth/ConfirmEmailErrorPage';
import { ConfirmEmailSuccessPage } from '@/components/auth/ConfirmEmailSuccessPage';
import { ForgotPasswordPage } from '@/components/auth/ForgotPasswordPage';
import { ForgotPasswordSuccessPage } from '@/components/auth/ForgotPasswordSuccessPage';
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage';
import { Toaster } from '@/components/ui/sonner';

export const Root = () => {
  return (
    <div className="h-screen">
      <Toaster />
      <Navbar />
      <div className="min-h-[calc(100vh-var(--navbar-height))] mx-auto px-4 container">
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
          <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
          <Route path="/confirm-email">
            <Route index element={<ConfirmEmailPage />} />
            <Route path="success" element={<ConfirmEmailSuccessPage />} />
            <Route path="error" element={<ConfirmEmailErrorPage />} />
          </Route>
          <Route path="/forgot-password">
            <Route index element={<ForgotPasswordPage />} />
            <Route path="success" element={<ForgotPasswordSuccessPage />} />
          </Route>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};
