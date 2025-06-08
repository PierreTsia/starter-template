import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const EmailConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the link to confirm your email address. If you don't
            see the email, check your spam folder.
          </p>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Back to login
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Once you've confirmed your email, you can log in to your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
