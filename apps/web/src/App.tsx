import { useAuth } from './hooks/useAuth';

import { useMe } from '@/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const App = () => {
  const { data: user, isLoading } = useMe();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
              <p>{new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
