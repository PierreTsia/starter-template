import { AppSettings } from './AppSettings';
import { AuthSettings } from './AuthSettings';

import { useMe } from '@/api/resources/auth/hooks';
import { UserProfile } from '@/components/UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';
import { PageTitle } from '@/components/ui/page-title';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { data: user, refetch: refetchMe } = useMe();

  const isGoogleUser = user?.provider === 'google';

  return (
    <Page>
      <PageTitle title={t('settings.title')} description={t('settings.description')} centered />
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.user.title')}</CardTitle>
            <CardDescription>{t('settings.user.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && <UserProfile data-testid="user-profile" me={user} refetchMe={refetchMe} />}
          </CardContent>
        </Card>

        {!isGoogleUser && (
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.auth.title')}</CardTitle>
              <CardDescription>{t('settings.auth.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AuthSettings />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.app.title')}</CardTitle>
            <CardDescription>{t('settings.app.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AppSettings />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
