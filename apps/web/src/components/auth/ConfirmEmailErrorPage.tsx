import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ResendConfirmationEmailDialog } from './ResendConfirmationEmailDialog';

import { isApiError, ErrorCodes } from '@/api/errors';
import { useAuth } from '@/api/resources/auth/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const ConfirmEmailErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resendConfirmation } = useAuth();
  const error = location.state?.error;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isExpiredToken =
    isApiError(error) && error.code === ErrorCodes.AUTH.CONFIRMATION_TOKEN_EXPIRED;

  const handleResend = (email: string) => {
    resendConfirmation(email);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.confirmEmail.error.title')}</CardTitle>
          <CardDescription>{t('auth.confirmEmail.error.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {error?.message || t('auth.confirmEmail.error.message')}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col space-y-2">
            {isExpiredToken ? (
              <>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full">
                  {t('auth.confirmEmail.error.resendConfirmation')}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {t('auth.confirmEmail.error.resendHint')}
                </p>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/register')} className="w-full">
                  {t('auth.confirmEmail.error.tryAgain')}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {t('auth.confirmEmail.error.hint')}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ResendConfirmationEmailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleResend}
      />
    </div>
  );
};
