import { useLocation, useNavigate } from 'react-router-dom';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, error, resetError } = useAuth();
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        )}
        {isLogin ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <RegisterForm onSubmit={handleRegister} />
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
}
