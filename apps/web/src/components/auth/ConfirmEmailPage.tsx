import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/api/resources/auth/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { confirmEmail } = useAuth();
  const hasAttemptedConfirmation = useRef(false);
  const token = searchParams.get('token');
  const { t } = useTranslation();

  useEffect(() => {
    if (token && !hasAttemptedConfirmation.current) {
      hasAttemptedConfirmation.current = true;
      confirmEmail(token);
    }
  }, [token, confirmEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-spinner" />
          <p className="mt-4 text-sm text-muted-foreground">{t('auth.confirmEmail.confirming')}</p>
        </CardContent>
      </Card>
    </div>
  );
};
