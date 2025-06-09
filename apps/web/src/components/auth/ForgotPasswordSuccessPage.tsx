import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const ForgotPasswordSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.forgotPassword.success.title')}</CardTitle>
          <CardDescription>{t('auth.forgotPassword.success.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              {t('auth.forgotPassword.backToLogin')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
