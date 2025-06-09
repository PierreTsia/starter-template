import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const ConfirmEmailSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.confirmEmail.success.title')}</CardTitle>
          <CardDescription>{t('auth.confirmEmail.success.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              {t('auth.confirmEmail.success.goToLogin')}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.confirmEmail.success.canLogin')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
