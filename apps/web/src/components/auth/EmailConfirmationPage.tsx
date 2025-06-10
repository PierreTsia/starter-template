import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const isResend = searchParams.get('resend') === 'true';
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.checkEmail.title')}</CardTitle>
          <CardDescription>
            {email ? (
              <>
                {isResend
                  ? t('auth.checkEmail.descriptionResend')
                  : t('auth.checkEmail.description')}
                <b className="font-bold text-green-500">{email}</b>
              </>
            ) : (
              t('auth.checkEmail.descriptionNoEmail')
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('auth.checkEmail.instructions')}</p>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              {t('auth.checkEmail.backToLogin')}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.checkEmail.afterConfirmation')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
