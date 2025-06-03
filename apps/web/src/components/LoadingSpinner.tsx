import { Card, CardContent } from '@/components/ui/card';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Card className="w-48 p-4 shadow-md">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </CardContent>
    </Card>
  </div>
);

LoadingSpinner.displayName = 'LoadingSpinner';
