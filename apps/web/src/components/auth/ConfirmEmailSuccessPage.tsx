import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ConfirmEmailSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Confirmed!</CardTitle>
          <CardDescription>Your email has been successfully confirmed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              You can now log in to your account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
