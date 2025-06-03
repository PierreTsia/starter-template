import { useLocation, useNavigate } from 'react-router-dom';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

import { useMe } from '@/api/hooks';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, error, resetError, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isUserLoading } = useMe();
  const isLogin = location.pathname === '/login';

  const handleLogin = async (data: LoginFormData) => {
    login(data);
  };

  const handleRegister = async (data: RegisterFormData) => {
    register(data);
  };

  const switchForm = () => {
    resetError();
    navigate(isLogin ? '/register' : '/login');
  };

  const isLoading = isAuthLoading || isUserLoading;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        )}
        {isLogin ? (
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        ) : (
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        )}
        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={switchForm}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};
