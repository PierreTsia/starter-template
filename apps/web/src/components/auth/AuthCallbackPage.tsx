import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Page } from '../ui/page';

import { useTranslation } from '@/i18n/hooks/useTranslation';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');
    const provider = params.get('provider');

    if (error) {
      toast.error(t('auth.google.error', { error: decodeURIComponent(error) }));
      navigate('/login');
      return;
    }

    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (provider) localStorage.setItem('provider', provider);

      window.history.replaceState({}, document.title, '/');
      navigate('/');
      toast.success(t('auth.google.success'));
    }
  }, [navigate, t]);

  return (
    <Page>
      <h2>{t('auth.google.authenticating')}</h2>
      <p>{t('auth.google.redirecting')}</p>
    </Page>
  );
};
