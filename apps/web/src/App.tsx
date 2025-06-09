import { useAuth, useMe } from '@/api/resources/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const App = () => {
  const { logout, isLoading } = useAuth();
  const { data: me } = useMe();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return;
  }

  return (
    <div className="container">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('common.welcome', { name: me?.name })}</CardTitle>
          <Button variant="outline" onClick={handleLogout}>
            {t('auth.logout')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('auth.email')}</h3>
              <p>{me?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('profile.memberSince')}
              </h3>
              <p>{new Date(me?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
