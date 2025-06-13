import { FaGoogle } from 'react-icons/fa';

import { Button } from '../ui/button';

import { useTranslation } from '@/i18n/hooks/useTranslation';

const API_URL = import.meta.env.VITE_API_URL;

export const GoogleSignIn = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
      <FaGoogle className="mr-2 h-4 w-4" />
      {t('auth.google.signIn')}
    </Button>
  );
};
