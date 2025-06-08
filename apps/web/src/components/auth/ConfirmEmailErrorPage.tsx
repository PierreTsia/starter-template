import { useNavigate } from 'react-router-dom';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ConfirmEmailErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirmation Failed</CardTitle>
          <CardDescription>We were unable to confirm your email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              The confirmation link may have expired or is invalid
            </AlertDescription>
          </Alert>
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/register')} className="w-full">
              Try Registering Again
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              You can create a new account with your email
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
