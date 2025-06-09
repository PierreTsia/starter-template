import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

import { useAuth, useMe } from '@/api/resources/auth/hooks';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import type { LoginFormData, RegisterFormData } from '@/types/auth';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, register, error, resetError, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isUserLoading } = useMe();
  const isLogin = location.pathname === '/login';

  const handleLogin = async (data: LoginFormData) => {
    login(data);
  };

  const handleRegister = async (data: RegisterFormData) => {
    const { confirmPassword: _, ...rest } = data;
    register(rest);
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
            {error instanceof Error ? error.message : t('common.error')}
          </div>
        )}
        {isLogin ? (
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        ) : (
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        )}
        <p className="text-center text-sm text-gray-500">
          {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={switchForm}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
          </button>
        </p>
        {isLogin && (
          <p className="text-center text-sm text-gray-500">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              {t('auth.forgotPassword.title')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
