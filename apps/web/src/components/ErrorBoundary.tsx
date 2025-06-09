import { AlertCircle, RefreshCcw } from 'lucide-react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/60 space-y-12">
      <img
        src="/bug-fixing.svg"
        alt="Bug fixing illustration"
        className="w-[640px] max-w-[80vw] h-auto opacity-80 drop-shadow-lg select-none pointer-events-none"
      />
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>{t('common.somethingWentWrong')}</CardTitle>
          </div>
          <CardDescription>{error.message || t('common.unexpectedError')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={resetErrorBoundary} className="w-full">
            <RefreshCcw className="h-4 w-4 mr-2" />
            {t('common.tryAgain')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
      onError={(error) => {
        // Log error to your error tracking service here
        console.error('Error caught by boundary:', error);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
