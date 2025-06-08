import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/api/resources/auth/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmEmail, isLoading, error } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      confirmEmail(token);
    }
  }, [searchParams, confirmEmail]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Confirming your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{error ? 'Confirmation Failed' : 'Email Confirmed!'}</CardTitle>
          <CardDescription>
            {error
              ? 'We were unable to confirm your email'
              : 'Your email has been successfully confirmed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to confirm email'}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Back to login
            </Button>
            {!error && (
              <p className="text-sm text-muted-foreground text-center">
                You can now log in to your account
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
