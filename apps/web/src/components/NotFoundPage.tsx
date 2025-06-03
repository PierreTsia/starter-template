import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-lg h-auto p-4 text-center flex flex-col items-center justify-center sm:w-[550px] sm:h-[550px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Oups !</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src="/not-found.svg"
          alt="Not found illustration"
          className="mx-auto mb-4 w-40 h-40 object-contain sm:w-80 sm:h-80"
        />
        <p className="mb-4 text-sm text-muted-foreground md:text-lg">
          Sorry, the page you are looking for does not exist.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Go Home</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default NotFoundPage;
